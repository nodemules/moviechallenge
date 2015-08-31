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
    templateUrl: '../../partials/new-challenge-button',
    controller: 'miscController'
  };
})

.directive("topTenList", function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/top-ten-list',
    controller: 'listController'
  };
})

.directive("challengePosters", function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/challenge-posters'
  }
})

.directive("mainSearch", function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/main-search'
  }
})

//make this work at some point- needs to be formatted for x-editable
.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {

                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);
