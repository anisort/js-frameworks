import { Data, Params } from '@angular/router';

export interface RouterState {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string | null;
  data: Data;
}
