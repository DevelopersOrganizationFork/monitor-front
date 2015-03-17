angular.module('controllers').controller('navController', [
    '$scope', '$translate',
    function($scope, $translate) {
		$scope.activeTab='home';
		this.locale = "en_US";
		this.plClass = "grayscale";
		
        this.changeLanguagePl = function() {
			this.plClass = "";
			this.enClass = "grayscale";
			this.locale = "pl_PL";
			$translate.use(this.locale);
        }
		
		this.changeLanguageEn = function() {
			this.plClass = "grayscale";
			this.enClass = "";
			this.locale = "en_US";
			$translate.use(this.locale);
        }
	}
]);

/*angular.module('directives').directive('flagDir', function() {
    return function (scope, element, attrs) {
		scope.$watch(attrs.flagDir, function (newVal) {
			element.removeClass('grayscale');
		})
    }
});*/