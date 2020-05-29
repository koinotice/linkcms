import AceEditorCtrl from './aceEditorCtrl';

export default class OptionsTabCtrl extends AceEditorCtrl{
  constructor($scope, $injector, $rootScope, templateSrv){
    super($scope, $injector, $rootScope, templateSrv);
  }

  setValue(val){
    this.panel.eoptions = val;
  }

  getValue(){
    return this.panel.eoptions;
  }

  static buildDirective(){
    return () => ({
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/grafana-echart-panel/optionsTab.html',
      controller: OptionsTabCtrl,
    });
  }
}
