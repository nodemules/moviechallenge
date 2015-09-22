angular.module('MainApp.Controllers')

.controller('ModalDemoCtrl', function ($scope, $modal, $log, $timeout, $rootScope) {

  //$scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (id) {

/*    $timeout(function(){
          $scope.$parent.$broadcast('youtube-broadcast', id);
    })
*/
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
            templateUrl: '../../partials/youtube-modal',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: { 
              ytid: function() {
                return id;
              }
            }
/*            ,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }*/
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

})

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, ytid) {

/*  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };*/
    $scope.ytid = ytid;
    console.log(ytid);

    $scope.$on('youtube-broadcast', function(event, data){
        //  $scope.ytid = data;
          alert(data);
    })

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});