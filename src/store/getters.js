const getters = {
  token: state => state.user.token,
  projectId: state => state.project.projectId,
  userName: state => state.user.userName,
  userId: state => state.user.userId,
  departmentTreeList: state => state.project.departmentTreeList
}

export default getters
