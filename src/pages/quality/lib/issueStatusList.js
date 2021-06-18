//问题状态
export default [
  { value: 0, label: '草稿', color: '#cccccc' },
  { value: 1, label: '待整改', color: '#fedf50' },
  { value: 2, label: '待复查', color: '#0079fe' },
  { value: 3, label: '复查合格', color: '#25cc70' }
]

//表单类型
export const formType = [
  { value: 1, label: '工程质量通知单' },
  { value: 2, label: '工程业务联系单' },
  { value: 3, label: '工作业务联系单' }
]
//审批状态
export const statusType = [
  { value: 0, label: '草稿', color: '#fedf50' },
  { value: 1, label: '审批中', color: '#0079fe' },
  { value: 2, label: '合格', color: '#10e410' },
  { value: 3, label: '不合格', color: 'red' }
]
