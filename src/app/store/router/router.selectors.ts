import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';
import { RouterState } from './router.state';

export const selectRouter =
  createFeatureSelector<RouterReducerState<RouterState>>('router');

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectRouteDataParam,
  selectUrl,
  selectTitle
} = getRouterSelectors(selectRouter);
