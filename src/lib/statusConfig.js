export const STATUS_CONFIG = {
  APPLIED: {
    label: 'Applied',
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  SCREENING: {
    label: 'Screening',
    classes: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  INTERVIEW: {
    label: 'Interview',
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  OFFER: {
    label: 'Offer',
    classes: 'bg-green-50 text-green-700 border-green-200',
  },
  REJECTED: {
    label: 'Rejected',
    classes: 'bg-red-50 text-red-700 border-red-200',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    classes: 'bg-gray-100 text-gray-500 border-gray-200',
  },
}

export const ALL_STATUSES = Object.keys(STATUS_CONFIG)
