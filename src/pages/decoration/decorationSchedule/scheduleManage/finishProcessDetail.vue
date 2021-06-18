<template>
  <view class="main">
    <view class="info-view">房间号：{{ detailData.roomDetailName }}</view>
    <view class="info-view">使用工序组：{{ detailData.procedureGroupName }}</view>
    <view class="info-view">工序名称：{{ detailData.procedureName }}</view>
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <view v-for="(item, index) in labourInfoList" :key="index" class="form-card">
          <view class="header">
            <view>{{ index + 1 }}：<span class="title">工序负责班组</span></view>
          </view>
          <uni-form-custom>
            <uni-form-item label="工序负责班组">{{ item.labourGroupDetailName }}</uni-form-item>
            <uni-form-item label="人工费用(元)">{{ item.labourStaffCosts }}</uni-form-item>
            <uni-form-item v-if="item.materialList && item.materialList.length" label="工序耗材"></uni-form-item>
            <view class="materials-con">
              <view v-for="(row, index) in item.materialList" :key="index" class="materials-item">
                <view class="title">{{ row.name }}</view>
                <view class="detail">
                  <view class="detail-item">
                    <view class="label">型号</view>
                    <view class="value">{{ row.models }}</view>
                  </view>
                  <view class="detail-item">
                    <view class="label">用量</view>
                    <view class="value">{{ row.dosage }}</view>
                  </view>
                </view>
              </view>
            </view>
            <uni-form-item v-if="item.fileId" label="附件">
              <uni-attachment v-model="item.fileId"></uni-attachment>
            </uni-form-item>
          </uni-form-custom>
        </view>

        <view class="form-card">
          <view class="header"><view class="title">批注</view></view>
          <view v-if="commentList.length" class="comment-con">
            <view v-for="(item, index) in commentList" :key="index" class="comment-item">
              <view class="content">
                <view>内容：</view>
                <view>{{ item.content }}</view>
              </view>
              <view v-if="item.fileId" class="file">
                <view>附件：</view>
                <view><file-name-download :fileId="item.fileId" /></view>
              </view>
              <view class="item-bottom">
                <view class="creator">
                  <view>{{ item.creatorName }}</view>
                  <view>{{ item.updateTime }}</view>
                </view>
                <view class="operation">
                  <a v-if="item.creator === curUserId" @click="handleShowComment(item, index)">修改</a>
                  <a v-if="item.creator === curUserId" @click="handleRemoveComment(index)">删除</a>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="comment-con-no-data">暂无数据</view>
        </view>
      </view>
    </scroll-view>

    <view class="btn-wrapper">
      <button class="button" @click="handleShowComment({}, null)">新增批注</button>
      <br />
      <button class="button" type="primary" :loading="btnLoading" :disabled="btnLoading" @click="handleSave">
        保 存
      </button>
    </view>

    <!--批注模态框组件--开始-->
    <uni-drawer ref="commentModal" :width="750" mode="right">
      <comment-modal :comment="comment" @closeCommentModal="closeCommentModal" />
    </uni-drawer>
    <!--批注模态框组件--结束-->
  </view>
</template>

<script>
import Api from './api'
import CommentModal from './commentModal'
import FileNameDownload from './fileNameDownload'
export default {
  components: { CommentModal, FileNameDownload },
  data() {
    return {
      btnLoading: false,
      detailData: {},
      labourInfoList: [],
      commentList: [],
      comment: {
        creator: '',
        content: '',
        fileId: '',
        id: ''
      },
      commentIndex: null,
      deleteIdArray: [] // 需要删除的批注id集合
    }
  },
  onLoad(options) {
    this.scheduleId = options.scheduleId || ''
    this.scheduleProcedureId = options.scheduleProcedureId || ''
    this.curUserId = this.$store.state.user.userId
  },
  async created() {
    if (this.scheduleProcedureId) {
      uni.showLoading()
      await this.getScheduleProcedureDetail(this.scheduleProcedureId)
      uni.hideLoading()
    }
  },
  methods: {
    // 获取进度(房间号、工序组名称)工序(工序名称、标准耗材)详情
    async getScheduleProcedureDetail(id) {
      let res = await Api.getScheduleProcedureDetail(id)
      // console.log(res)
      this.detailData = res.data
      this.labourInfoList = this.detailData.labourInfoList
      this.commentList = _.cloneDeep(this.detailData.remarkList)
    },
    // 显示批注模态框
    handleShowComment(comment, index) {
      this.$refs.commentModal.open()
      this.comment = comment
      this.commentIndex = index
    },
    // 模态框关闭、数据回传操作
    closeCommentModal(comment) {
      if (comment) {
        let remark = {
          id: comment.id ? comment.id : '',
          creator: this.curUserId,
          creatorName: this.$store.state.user.userName,
          content: comment.content,
          fileId: comment.fileId ? comment.fileId : '',
          updateTime: comment.updateTime
        }
        if (this.commentIndex !== null) {
          // 修改
          this.commentList.splice(this.commentIndex, 1, remark)
        } else {
          // 新增
          this.commentList.push(remark)
        }
      }
      this.$refs.commentModal.close()
    },
    // 删除批注
    handleRemoveComment(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该批注？',
        success: res => {
          if (res.confirm) {
            let comment = this.commentList.filter((item, i) => i === index)[0]
            if (comment.id) {
              this.deleteIdArray.push(comment.id)
            }
            this.commentList.splice(index, 1)
          }
        }
      })
    },
    // 批注保存
    handleSave() {
      let params = {
        remarkAddOrUpdateList: [],
        remarkIdList: [],
        scheduleProcedureId: this.scheduleProcedureId
      }
      this.commentList.map(item => {
        params.remarkAddOrUpdateList.push({
          content: item.content,
          fileId: item.fileId,
          creator: item.creator,
          id: item.id
        })
      })
      this.deleteIdArray.map(id => {
        params.remarkIdList.push(id)
      })
      // console.log(params)
      this.btnLoading = true
      uni.showLoading()
      Api.allOperationScheduleProcedureRemark(params).then(
        res => {
          uni.hideLoading()
          this.$utils.showToast('操作成功')
          // this.getScheduleProcedureDetail(this.scheduleProcedureId) // 刷新信息
          setTimeout(() => {
            this.$utils.goBack()
            this.btnLoading = false
          }, 1000)
        },
        err => {
          uni.hideLoading()
          this.btnLoading = false
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import './finishProcess.less';
.comment-con {
  font-size: 14px;
  color: #666666;
  margin: 20px;
  .comment-item {
    background: #f9f9f9;
    margin-bottom: 20px;
    padding: 10px;
    .content {
      display: flex;
      > view:nth-child(1) {
        flex: 0 0 80px;
      }
    }
    .file {
      display: flex;
      > view:nth-child(1) {
        flex: 0 0 80px;
      }
    }
    .item-bottom {
      display: flex;
      justify-content: space-between;
      .creator {
        display: flex;
        > view:nth-child(1) {
          margin-right: 20px;
        }
      }
      .operation {
        display: flex;
      }
      .operation a:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
}
.comment-con-no-data {
  color: #666666;
  font-size: 14px;
  padding: 20px;
  text-align: center;
}
</style>
