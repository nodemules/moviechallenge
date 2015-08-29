angular.module('MainApp.Directives', [])

.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})

.directive("newChallengeButton", function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/new-challenge-button',
    controller: 'miscController'
  };
})

.directive("topTenList", function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/top-ten-list',
    controller: 'listController'
  };
})

.directive("challengePosters", function() {
  return {
    restrict: 'E',
    templateUrl: '../partials/challenge-posters'
  }
});