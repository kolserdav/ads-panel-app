/// <reference types="react-scripts" />


export type OrAdminProps = {
  role: "admin" | "user" | "guest"
  children: string 
};

export type User = {
  id: number
  /*admin: 1 | 0
  confirmm: 1 | 0
  first_name: string
  last_name: string
  email: string
  company: string
  skype: string
  balance: number | null*/
}

export type ActionTypesUser = 'USER_FETCH_REQUESTED' | 'USER_FETCH_SUCCEEDED' | 'USER_FETCH_FAILED';

export type ActionTypes = 'INITIAL_TYPE' | ActionTypesUser;

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
  }
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


export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';