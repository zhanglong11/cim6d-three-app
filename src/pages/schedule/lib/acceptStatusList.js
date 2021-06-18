export const acceptStatusList = [
  { label: '草稿', value: 0 },
  { label: '待验收', value: 1 },
  { label: '通过', value: 2 },
  { label: '驳回', value: 3 }
]
export const getAcceptStatusByValue = value => _.find(acceptStatusList, { value })?.label ?? ''
