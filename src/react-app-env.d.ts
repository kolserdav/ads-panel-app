/// <reference types="react-scripts" />

export type PanelProps = {
  children: React.ReactElement
  window: () => Window
  namePage: string
}

export type DialogProps = {
  open: boolean
  title: string
  content: string
  handleClose: () => void
  handleAccept: () => void
}

export type AlertProps = {
  status: 'error' | 'succes' | 'warning' | 'info'
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

export type ActionTypes = 'INITIAL_TYPE' | ActionTypesUser | ActionTypesLogin |
 ActionTypesRegistration | ActionTypesConfirm | ActionTypesEmail | ActionTypesChangePass | 
 ActionTypesGraph;

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
  }
};

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
}

export type GraphData = {
  date: string
  clicks: number
  cost: number
}

export type GraphProps = {
  data: GraphData[]
}


export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type TimeValues = 'today' | 'yesterday' | 'last-3-days' | 'last-7-days' | 'this-month' | 'last-30-days' | 'last-month' | 'this-quarter' | 'this-year' | 'last-year' | 'custom';

export type SelectProps = {
  children: React.ReactElement[]
  handleChange: (event: React.ChangeEvent<{ value: any }>) => void
  value: any
}