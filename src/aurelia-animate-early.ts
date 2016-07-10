import { Container, FrameworkConfiguration } from 'aurelia-framework';
import { activationStrategy, ActivateNextStep, NavigationInstruction, Next, PipelineStep, PipelineProvider } from 'aurelia-router';

export function configure(config: FrameworkConfiguration) {
  // Fix the lack of postDeactivate step in built-in provider 
  config.container.registerSingleton(PipelineProvider, ExtendedPipelineProvider);

  const pipeline = config.container.get(PipelineProvider) as PipelineProvider;
  pipeline.addStep('postDeactivate', new PostDeactivateStep());
  pipeline.addStep('preRender', new PreRenderStep());
}

// This class simply adds 'postDeactivate' pipeline step
class ExtendedPipelineProvider extends PipelineProvider {
  // Note: the following defs are missing the PipelineProvider .d.ts
  steps: (PipelineStep | {new(): PipelineStep})[];
  _createPipelineSlot: (name: string, alias?: string) => PipelineStep; 

  constructor(container: Container) {
    super(container);
    const activateIndex = this.steps.indexOf(ActivateNextStep);
    this.steps.splice(activateIndex, 0, this._createPipelineSlot('postDeactivate'));
  }

  // This method is kind of hardcoded in PipelineProvider :(
  reset() {
    for (const slot of this.steps) {
      const name = slot['slotName'];
      if (name) slot['steps'] = [];
    }    
  }
}

// Remove views early in the pipeline.
// Don't wait on them, stash the promises in the instruction
class PostDeactivateStep implements PipelineStep {  
  run(instruction: NavigationInstruction, next: Next) {
    const router = instruction['router'];
    const unloads = instruction['animate-early-unloads'] = <any>[];
    for (const viewPortName in instruction.viewPortInstructions) {
      const viewPortInstuction = instruction.viewPortInstructions[viewPortName]; // any :(
      const viewPort = router.viewPorts[viewPortName];  // any :(
      if (viewPortInstuction.strategy === activationStrategy.replace && viewPort.view)
        unloads.push(viewPort.viewSlot.remove(viewPort.view, true));
    }
    return next();
  }
}

// Wait on the animations before inserting the new views
class PreRenderStep implements PipelineStep {
  run(instruction: NavigationInstruction, next: Next) {
    const unloads: any[] = instruction['animate-early-unloads'];
    return Promise.all(unloads).then(next);
  }
}