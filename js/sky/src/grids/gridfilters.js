/*global angular */

(function () {
    'use strict';
    angular.module('sky.grids.filters', ['sky.help', 'sky.resources', 'sky.mediabreakpoints'])
    .directive('bbGridFilters', ['bbHelp', 'bbResources', 'bbMediaBreakpoints', function (bbHelp, bbResources, bbMediaBreakpoints) {
        return {
            require: '^bbGrid',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                bbOptions: "="
            },
            controller: ['$scope', function ($scope) {
                $scope.applyFilters = function () {
                    var args = {},
                        options = $scope.bbOptions;

                    if (options && options.applyFilters) {
                        options.applyFilters(args);
                        $scope.updateFilters(args.filters);

                        if (bbMediaBreakpoints.getCurrent().xs) {
                            $scope.locals.expanded = false;
                        }
                    }
                };
                $scope.clearFilters = function () {
                    var args = {},
                        options = $scope.bbOptions;

                    if (options && options.clearFilters) {
                        options.clearFilters(args);
                        $scope.updateFilters(args.filters);
                    }
                };
            }],
            link: function ($scope, element, attrs, bbGrid) {
                /*jslint unparam: true */
                var box = element.find('.bb-grid-filters-box'),
                    filtersContainer = element.find('.bb-grid-filters-container');

                $scope.locals = {
                    expanded: false
                };

                $scope.viewKeeperOptions = {};

                bbGrid.viewKeeperChangedHandler = function (val) {
                    $scope.viewKeeperOptions.viewKeeperOffsetElId = val;
                };

                bbGrid.toggleFilterMenu = function (isOpen) {
                    if (angular.isDefined(isOpen)) {
                        $scope.locals.expanded = isOpen;
                    } else {
                        $scope.locals.expanded = !$scope.locals.expanded;
                    }

                    if ($scope.locals.expanded) {
                        bbHelp.close();
                    }
                };

                bbGrid.openFilterMenu = function () {
                    $scope.locals.expanded = true;
                };

                bbGrid.scope.$watch('gridCreated', function (newValue) {
                    if (newValue) {
                        element.parents('.bb-grid-container').prepend(element);
                        element.show();

                        if ($scope.locals.expanded) {
                            animateFilters($scope.locals.expanded);
                        }
                    }
                });

                $scope.updateFilters = function (filters) {
                    bbGrid.setFilters(filters);
                };

                $scope.resources = bbResources;

                function animateFilters(isExpanded) {
                    var animationDuration = 250;
                    if (isExpanded) {
                        box.css('left', '240px');
                        filtersContainer.show();
                        box.animate({ 'left': '0' }, animationDuration);
                    } else {
                        box.animate({ 'left': '240px' }, {
                            duration: animationDuration,
                            complete: function () {
                                box.css('left', '0');
                                filtersContainer.hide();
                            }
                        });
                    }
                }

                $scope.$watch('locals.expanded', function (newValue, oldValue) {
                    if (newValue !== oldValue || newValue) {
                        animateFilters(newValue);
                    }
                });

            },
            templateUrl: 'sky/templates/grids/filters.html'
        };
    }])
    .directive('bbGridFiltersGroup', function () {
        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                bbGridFiltersGroupLabel: '=',
                isCollapsed: '=?bbGridFiltersGroupIsCollapsed'
            },
            templateUrl: 'sky/templates/grids/filtersgroup.html'
        };
    })
    .directive('bbGridFiltersSummary', ['bbResources', function (bbResources) {
        return {
            require: '^bbGrid',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                bbOptions: "="
            },
            controller: ['$scope', function ($scope) {
                $scope.clearFilters = function () {
                    var args = {},
                        options = $scope.bbOptions;

                    if (options && options.clearFilters) {
                        options.clearFilters(args);
                        $scope.updateFilters(args.filters);
                    }
                };

                $scope.resources = bbResources;

            }],
            link: function ($scope, element, attrs, bbGrid) {
                /*jslint unparam: true */

                bbGrid.scope.$watch('gridCreated', function () {
                    var toolbarContainer = element.parents('.bb-grid-container').find('.bb-grid-toolbar-container .bb-grid-filter-summary-container');
                    toolbarContainer.append(element);
                });


                $scope.updateFilters = function (filters) {
                    bbGrid.setFilters(filters);
                };

                $scope.openFilterMenu = function () {
                    if (bbGrid.openFilterMenu) {
                        bbGrid.openFilterMenu();
                    }
                };
                $scope.$watch(function () {
                    return element.is(':visible');
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        bbGrid.syncViewKeepers();
                    }
                });
            },
            templateUrl: 'sky/templates/grids/filterssummary.html'
        };
    }]);

}());
