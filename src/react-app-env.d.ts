/// <reference types="react-scripts" />

export type PanelProps = {
  children: React.ReactElement
  window: () => Window
  namePage: string
}

export type DialogProps = {
  open: boolean
  title: string
  content: string | React.ReactElement
  handleClose: () => void
  handleAccept: () => void
}

export type DialogState = {
  id: number
  open: boolean
  title: string
  content: string | React.ReactElement
  handleAccept: (e: any) => void
}

export type AlertProps = {
  status: 'error' | 'success' | 'warning' | 'info'
  message: string
  open?: boolean
}

export type Roles = "admin" | "user" | "guest";

export type AuthProps = {
  roles: Roles[]
  children: any
  redirect: boolean // Когда просто нужно скрыть элемент то false и trueб когда нужно редиректить на страницу входа
};

export type User = {
  id: number
  admin: 1 | 0
  confirmm: 1 | 0
  first_name: string
  last_name: string
  email: string
  company: string
  skype: string
  balance: number | null
}

export type ActionTypesUser = 'USER_FETCH_REQUESTED' | 'USER_FETCH_SUCCEEDED' | 'USER_FETCH_FAILED';
export type ActionTypesLogin = 'LOGIN_REQUESTED' | 'LOGIN_SUCCEEDED' | 'LOGIN_FAILED';
export type ActionTypesRegistration = 'REGISTRATION_REQUESTED' | 'REGISTRATION_SUCCEEDED' | 'REGISTRATION_FAILED';
export type ActionTypesConfirm = 'CONFIRM_REQUESTED' | 'CONFIRM_SUCCEEDED' | 'CONFIRM_FAILED';
export type ActionTypesEmail = 'EMAIL_REQUESTED' | 'EMAIL_SUCCEEDED' | 'EMAIL_FAILED';
export type ActionTypesChangePass = 'CHANGE_PASS_REQUESTED' | 'CHANGE_PASS_SUCCEEDED' | 'CHANGE_PASS_FAILED';
export type ActionTypesGraph = 'GRAPH_REQUESTED' | 'GRAPH_SUCCEEDED' | 'GRAPH_FAILED';
export type ActionTypesTable = 'TABLE_REQUESTED' | 'TABLE_SUCCEEDED' | 'TABLE_FAILED';
export type ActionTypesCampaignsGet = 'GET_CAMPAIGNS_REQUESTED' | 'GET_CAMPAIGNS_SUCCEEDED' | 'GET_CAMPAIGNS_FAILED';
export type ActionTypesChangeCampaignStatus = 'CHANGE_CAMPAIGN_STATUS_REQUESTED' | 'CHANGE_CAMPAIGN_STATUS_SUCCEEDED' | 'CHANGE_CAMPAIGN_STATUS_FAILED';
export type ActionTypesCreateCampaign = 'CREATE_CAMPAIGN_REQUESTED' | 'CREATE_CAMPAIGN_SUCCEEDED' | 'CREATE_CAMPAIGN_FAILED';
export type ActionTypesSearchCounrties = 'SEARCH_COUNTRIES_REQUESTED' | 'SEARCH_COUNTRIES_SUCCEEDED' | 'SEARCH_COUNTRIES_FAILED';
export type ActionTypesGetOffers = 'GET_OFFERS_REQUESTED' | 'GET_OFFERS_SUCCEEDED' | 'GET_OFFERS_FAILED';
export type ActionTypesCreateOffer = 'CREATE_OFFER_REQUESTED' | 'CREATE_OFFER_SUCCEEDED' | 'CREATE_OFFER_FAILED';
export type ActionTypesUploadOfferIcon = 'UPLOAD_OFFER_ICON_REQUESTED' | 'UPLOAD_OFFER_ICON_SUCCEEDED' | 'UPLOAD_OFFER_ICON_FAILED';
export type ActionTypesUploadOfferImage = 'UPLOAD_OFFER_IMAGE_REQUESTED' | 'UPLOAD_OFFER_IMAGE_SUCCEEDED' | 'UPLOAD_OFFER_IMAGE_FAILED';
export type ActionTypesDeleteCampaign = 'DELETE_CAMPAIGN_REQUESTED' | 'DELETE_CAMPAIGN_SUCCEEDED' | 'DELETE_CAMPAIGN_FAILED';

export type ActionTypes = 'INITIAL_TYPE' | ActionTypesUser | ActionTypesLogin |
 ActionTypesRegistration | ActionTypesConfirm | ActionTypesEmail | ActionTypesChangePass | 
 ActionTypesGraph | ActionTypesTable | ActionTypesCampaignsGet | ActionTypesChangeCampaignStatus | 
 ActionTypesCreateCampaign | ActionTypesSearchCounrties | ActionTypesGetOffers |
 ActionTypesCreateOffer | ActionTypesUploadOfferIcon | ActionTypesUploadOfferImage | 
 ActionTypesDeleteCampaign;

// Редьюсеры проверяют типы толко в компонентах, до store/reducers.ts почему-то не дотягивается
export type Reducer = {
  type: ActionTypes
  data?: Action 
  initialData?: action
  userData?: Action
  loginData?: Action
  registerData?: Action
  confirmData?: Action
  emailData?: Action
  passData?: Action
  graphData?: Action
  tableData?: Action
  getCampaignsData?: Action
  changeCampaignStatusData?: Action
  createCampaignData?: Action
  searchCountriesData?: Action
  getOffersData?: Action
  createOfferData?: Action
  uploadOfferIconData?: Action
  uploadOfferImageData?: Action
  deleteCampaignData?: Action
}

export type TableStatistic = {
  date: Date
  campaign: number
  subid: string
  country: string
  requests: number
  impressions: number
  clicks: number
  cost: number
  win_ratio?: number
  ctr?: number
};

export type OfferStatus = 'verified' | 'pending' | 'warning';

export type CampaignStatus = 'active' | 'pause' | 'pending' | 'budget';

export type Campaign = {
  id?: number
  title: string
  status: CampaignStatus
  link: string
  countries: string[]
  price: number
  user_id: number
  budget: number
  offer_id: number
  ip_pattern: string[]
  white_list: string[]
  black_list: string[]
};

export type Offer = {
  id?: number
  status: OfferStatus
  warning: string
  user_id: number
  title: string
  description: string
  icon?: string
  image?: string
  count?: number
};

export type Transaction = {
  amount: number
  user_id?: number
  date?: date
  comment: string
};

export type User = {
  id?: number
  confirm?: 0 | 1
  admin?: 0 | 1
  first_name: string
  last_name: string
  email: string
  password: string
  company: string
  skype: string
  created?: Date
  updated: Date
};

export type Country = {
  id?: number
  code: string
  name: string
}

export type ServerResponse = {
  result: 'error' | 'warning' | 'success' | 'wait'
  message: string
  body: {
    table?: TableStatistic[]
    graph?: TableStatistic[]
    require?: any
    received?: any
    email?: string
    url?: string
    stdErrMessage?: string
    token?: string
    errAuth?: boolean
    errRole?: boolean
    user?: User
    offer?: Offer
    offers?: Offer[]
    campaign?: Campaign
    campaigns?: Campaign[]
    count?: number
    all?: any
    insertId?: number
    transactions?: Transaction[]
    countries?: Country[]
  },
  errorData?: ServerResponse
}

export type Action = {
  type: ActionTypes
  data?: ServerResponse
  args? : {
    token?: string
    body?: any
    params?: any
    id?: number
  }
};

export type GraphProps = {
  data: GraphData[]
}

export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type TimeValues = 'today' | 'yesterday' | 'last-3-days' | 'last-7-days' | 'this-month' | 'last-30-days' | 'last-month' | 'this-quarter' | 'this-year' | 'last-year' | 'custom';

export type SelectProps = {
  children: React.ReactElement[]
  handleChange: (event: React.ChangeEvent<{ value: any }>) => void
  value: any
  name: string
}

export type ListElementProps = {
  children: React.ReactElement
  title: string
  value: string | number
}

export type AllStat = {
  cost?: number
  impressions: number
  clicks: number
  requests: number
}

export type DatePicker = {
  startDate: Date
  onChange: (date: Date) => void
}

export type TableStatisticRow = {
  first: string
  value: any
  second: string
  impressions: number
  requests: number
  cost: number
  clicks: number
  ctr: number
  requests: number
  winRatio: number
  countEvents: number
}

export type TableStatisticProps = {
  firstColumn: string
  rows: TableStatisticRow[]
  icons: SortIconsElements
}

// Возможные варианты группировок
export type GroupBy = 'date' | 'user' | 'campaign' | 'subid' | 'country';

export type OrderByGroupedVariants = 'date' | 'campaign' | 'subid' | 'country'

export type OrderByStaticVariants = 'requests' | 'impressions' | 'clicks' | 'cost';

export type OrderByVariants = OrderByStaticVariants  | OrderByGroupedVariants;

export type SortIcons = {
  value: OrderByGroupedVariants
  requests: OrderByStaticVariants
  impressions: OrderByStaticVariants
  clicks: OrderByStaticVariants
  cost: OrderByStaticVariants
}

export type SortIconsElements = {
  value: React.ReactElement
  requests: React.ReactElement
  impressions: React.ReactElement
  clicks: React.ReactElement
  cost: React.ReactElement
}

export type Pagination = {
  count: number
  page: number
  rowsPerPage: number
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

// Тип  статусов кампаний 
export type CampaignStatus = 'active' | 'pause' | 'pending' | 'budget';

export type TableCampaignsProps = {
  rows: TableCampaignsRow[]
  handleChangeStatus: (status: CampaignStatus, name: string, id: number) => (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  handleDelete: (name: string, id: number) => (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export type TableCampaignsRow = {
  title: string
  status: CampaignStatus
  owner: string
  id: number
  price: number
  budget: number
  countries: string[]
  offer: string
  ipPattern: string[]
  whiteList: string[]
  blackList: string[]
  created: string
  updated: string
  userId: number
}

export type DialogOperations = 'status' | 'change' | 'delete'

export type DialogContentProps = {
  statusInit: CampaignStatus
  name: string
  options: React.ReactElement[]
}

export type PopperProps = {
  anchorEl: null | HTMLElement
  content: ReactElement<any, any>
}