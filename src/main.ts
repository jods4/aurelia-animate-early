import { Aurelia } from 'aurelia-framework';

export function configure(aurelia: Aurelia) {
  // Converter UIkit animations to au-enter-active and au-leave-active
  createAureliaAnimations();

  if (window['earlyAnimation'] = confirm("Animate early?")) {
    aurelia.use.plugin('src/aurelia-animate-early');
  }

  aurelia.use
         .standardConfiguration()
         .developmentLogging()
         .plugin('aurelia-animator-css');      

  aurelia.start()
         .then(() => aurelia.setRoot('src/app'));
}

// basically copy .uk-animation-scale-up to .au-enter
// and .uk-animation-scale-down.uk-animation-reverse to .au-leave
function createAureliaAnimations() {  
  const styleSheet = document.styleSheets[0] as CSSStyleSheet;
  const rules = Array.from(styleSheet.cssRules);
  const animations = getStyle("class\\*=uk-animation-");
  const reverse = getStyle("uk-animation-reverse");
  const scaleUp = getStyle("uk-animation-scale-up");
  const scaleDown = getStyle("uk-animation-scale-down");
    
  styleSheet.insertRule(".au-enter-active {" + animations + scaleUp + "}");
  styleSheet.insertRule(".au-leave-active {" + animations + scaleDown + reverse + "}");

  function getStyle(match: string) {
    const re = new RegExp(match);
    return (rules.find(r => re.test(r.cssText)) as CSSStyleRule)
                 .style.cssText;
  }
}