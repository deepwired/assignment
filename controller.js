var app = angular.module('webonise', ['angularUtils.directives.dirPagination']);

app.controller('students', function ($scope, $http, promisJson) {
    //sorting out the filters
    $scope.search = {};
    $scope.search.name = "";
    $scope.search.rollNo = "";

    //for the loader
    $scope.loader = 1;

    //promis
    promisJson.fetch().then(function (data) {
        $scope.data = data;
        $scope.loader = 0;
        $scope.totalStudents = _.keys($scope.data).length
        $scope.filteredData = $scope.data
        $scope.failCount = $scope.data.filter(function (value) {
            return value.percentage < 40
        }).length;
    })

    //ng-class for all those who scored less than 40
    $scope.isFail = function (per)
    {
        if (per >= 40)
        {
            return ''
        }
        return 'fail'

    }

    //filtering with or condition
    $scope.filter = function ()
    {
        $scope.filteredData = []
        for (i in $scope.data) {
            if ($scope.search.rollNo == "" && $scope.search.name == "")
            {
                $scope.filteredData = $scope.data
                break;
            } else if ($scope.data[i].rollNo == $scope.search.rollNo || $scope.data[i].name == $scope.search.name)
            {
                $scope.filteredData.push($scope.data[i])
            }
        }
    }

    //initial sorting
    $scope.sortColumn = 'rollNo';
    //initial ordering
    $scope.reverseSort = false;
    //order by swap
    $scope.sortData = function (column)
    {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column;
    }
    //assigning arrow keys
    $scope.getSortClass = function (column)
    {
        if ($scope.sortColumn == column)
        {
            return $scope.reverseSort ? 'arrow-down' : 'arrow-up';
        }
        return '';
    }
    //number of records per page
    $scope.incrementCount = function () {
        if ($scope.count >= 10) {
            return;
        }
        $scope.countS++;
    }
    $scope.decrementCount = function () {
        if ($scope.count == 1) {
            return;
        }
        $scope.countS--;
    }
});
app.factory('promisJson', function ($q, $timeout, $http) {
    var studentdata = {
        fetch: function (callback) {
            return $timeout(function () {
                return $http.get('data.json').then(function (response) {
                    return response.data;
                });
            }, 30);
        }
    };
    return studentdata;
});

app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }]);