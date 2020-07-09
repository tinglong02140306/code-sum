-----------------------------------------------------
-- Export file for user U_WJEWT                    --
-- Created by Administrator on 2018/1/30, 14:54:12 --
-----------------------------------------------------

create table SERVICE_DICTIONARY
(
  ID        VARCHAR2(50) not null,
  CODE      VARCHAR2(20),
  NAME      VARCHAR2(50),
  TYPE      VARCHAR2(20),
  ORDER_NUM INTEGER,
  ENABLE    VARCHAR2(1) default '1'
)
;
comment on table SERVICE_DICTIONARY
  is '业务字典表';
comment on column SERVICE_DICTIONARY.ID
  is '主键ID';
comment on column SERVICE_DICTIONARY.CODE
  is '字典编码';
comment on column SERVICE_DICTIONARY.NAME
  is '字典名称';
comment on column SERVICE_DICTIONARY.TYPE
  is '字典类型';
comment on column SERVICE_DICTIONARY.ORDER_NUM
  is '字典排序';
comment on column SERVICE_DICTIONARY.ENABLE
  is '有效性,0：无效，1：有效';
alter table SERVICE_DICTIONARY
  add constraint PK_SERVICE_DICTIONARY primary key (ID);

create table SERVICE_SYS_CONFIG
(
  ID     VARCHAR2(50) not null,
  KEY    VARCHAR2(20),
  VALUE  VARCHAR2(50),
  ENABLE VARCHAR2(1) default '1'
)
;
comment on table SERVICE_SYS_CONFIG
  is '系统平台配置信息';
comment on column SERVICE_SYS_CONFIG.ID
  is '主键ID';
comment on column SERVICE_SYS_CONFIG.KEY
  is '配置项';
comment on column SERVICE_SYS_CONFIG.VALUE
  is '配置数值';
comment on column SERVICE_SYS_CONFIG.ENABLE
  is '有效性,0：无效，1：有效';
alter table SERVICE_SYS_CONFIG
  add constraint PK_SERVICE_SYS_CONFIG primary key (ID);

create table SERVICE_YJNC_APPLY
(
  ID                   VARCHAR2(50) not null,
  APPLYER_USER_ID      VARCHAR2(50),
  APPLYER_NAME         VARCHAR2(50),
  APPLYER_MOBILE       VARCHAR2(20),
  CAR_PLATE_TYPE       VARCHAR2(2),
  CAR_PLATE_NUM        VARCHAR2(10),
  DRIVER_MOBILE        VARCHAR2(20),
  DRIVER_NAME          VARCHAR2(50),
  ADDRESS              VARCHAR2(200),
  POINT_X              VARCHAR2(50),
  POINT_Y              VARCHAR2(50),
  REASON_TYPE          VARCHAR2(1),
  APPLY_TIME           DATE,
  LAST_UPDATE_USER     VARCHAR2(30),
  LAST_UPDATE_TIME     DATE,
  PICTURES             VARCHAR2(300),
  DRIVER_ATTITUDE_RANK VARCHAR2(1),
  DRIVER_SPEED_RANK    VARCHAR2(1),
  EVALUATE_CONTENT     VARCHAR2(1000),
  STATUS               VARCHAR2(1),
  APLLY_PLATEFORM      VARCHAR2(1),
  DELETE_STATE         VARCHAR2(1) default '0',
  SMS_OR_NOT           VARCHAR2(1),
  TEL_OR_NOT           VARCHAR2(1),
  PRESSED_OR_NOT       VARCHAR2(1)
)
;
comment on table SERVICE_YJNC_APPLY
  is '一键挪车申请表';
comment on column SERVICE_YJNC_APPLY.ID
  is '主键ID';
comment on column SERVICE_YJNC_APPLY.APPLYER_USER_ID
  is '申请者用户ID';
comment on column SERVICE_YJNC_APPLY.APPLYER_NAME
  is '申请提交者姓名';
comment on column SERVICE_YJNC_APPLY.APPLYER_MOBILE
  is '申请者手机号';
comment on column SERVICE_YJNC_APPLY.CAR_PLATE_TYPE
  is '移车车牌类型字典@PLATE_TYPE，1：蓝色车牌（小型汽车），2：黄色车牌（大型汽车），9：其他车牌';
comment on column SERVICE_YJNC_APPLY.CAR_PLATE_NUM
  is '移车车牌号,默认只支持安徽省 皖 开头的车牌';
comment on column SERVICE_YJNC_APPLY.DRIVER_MOBILE
  is '车主手机号';
comment on column SERVICE_YJNC_APPLY.DRIVER_NAME
  is '车主姓名';
comment on column SERVICE_YJNC_APPLY.ADDRESS
  is '定位地址文本';
comment on column SERVICE_YJNC_APPLY.POINT_X
  is '定位坐标X';
comment on column SERVICE_YJNC_APPLY.POINT_Y
  is '定位坐标Y';
comment on column SERVICE_YJNC_APPLY.REASON_TYPE
  is '挪车原因编码字典@REASON_TYPE，1：您爱车挡道，请挪车，2：您车门窗灯未关，3：您违规停车，请挪车，4：急需挪车，请速来';
comment on column SERVICE_YJNC_APPLY.APPLY_TIME
  is '申请提交时间,日期类型';
comment on column SERVICE_YJNC_APPLY.LAST_UPDATE_USER
  is '最后更新人登录名';
comment on column SERVICE_YJNC_APPLY.LAST_UPDATE_TIME
  is '最后更新时间,日期类型';
comment on column SERVICE_YJNC_APPLY.PICTURES
  is '现场照片信息，最多三张，存储Fastdfs文件路径，逗号，隔开';
comment on column SERVICE_YJNC_APPLY.DRIVER_ATTITUDE_RANK
  is '车主挪车态度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评';
comment on column SERVICE_YJNC_APPLY.DRIVER_SPEED_RANK
  is '车主挪车速度评价字典@EVALUATE_LEVEL,1:差评，2：中评，3：好评';
comment on column SERVICE_YJNC_APPLY.EVALUATE_CONTENT
  is '评价内容';
comment on column SERVICE_YJNC_APPLY.STATUS
  is '移车状态字典@MOVE_STATUS：1：待挪车，2：挪车成功，3：挪车失败，4：待评价';
comment on column SERVICE_YJNC_APPLY.APLLY_PLATEFORM
  is '申请来源平台字典@APPLY_SOURCE，1：APP（安卓）,2：APP（IOS），3：微信公众号，4：小程序，5：支付宝生活号';
comment on column SERVICE_YJNC_APPLY.DELETE_STATE
  is '删除状态,0：未删除，1：已删除，逻辑删除字段';
comment on column SERVICE_YJNC_APPLY.SMS_OR_NOT
  is '是否短信通知,字典 @YES_NO 0：否，1：是';
comment on column SERVICE_YJNC_APPLY.TEL_OR_NOT
  is '是否电话通知,字典 @YES_NO 0：否，1：是';
comment on column SERVICE_YJNC_APPLY.PRESSED_OR_NOT
  is '是否已催办,字典 @YES_NO 0：否，1：是';
alter table SERVICE_YJNC_APPLY
  add constraint PK_SERVICE_YJNC_APPLY primary key (ID);

create table SERVICE_YJNC_TASKS
(
  ID            VARCHAR2(50) not null,
  APPLY_ID      VARCHAR2(50),
  EVENT_NAME    VARCHAR2(50),
  EVENT_TYPE    VARCHAR2(20),
  TARGET_OBJECT VARCHAR2(100),
  EVENT_TIME    DATE,
  EVENT_STATUS  VARCHAR2(1),
  EVENT_CONTENT VARCHAR2(500)
)
;
comment on table SERVICE_YJNC_TASKS
  is '一键挪车任务表';
comment on column SERVICE_YJNC_TASKS.ID
  is '主键ID';
comment on column SERVICE_YJNC_TASKS.APPLY_ID
  is '申请ID,关联申请表主键ID';
comment on column SERVICE_YJNC_TASKS.EVENT_NAME
  is '事件名称';
comment on column SERVICE_YJNC_TASKS.EVENT_TYPE
  is '事件类型，字典@EVENT_TYPE：1：发短信，2：打电话';
comment on column SERVICE_YJNC_TASKS.TARGET_OBJECT
  is '操作对象，手机号或者微信号或者QQ或者邮箱等';
comment on column SERVICE_YJNC_TASKS.EVENT_TIME
  is '事件发生时间,日期类型';
comment on column SERVICE_YJNC_TASKS.EVENT_STATUS
  is '事件结果状态  状态字典@EVENT_STATUS：1：成功，2：失败';
comment on column SERVICE_YJNC_TASKS.EVENT_CONTENT
  is '事件操作内容';
alter table SERVICE_YJNC_TASKS
  add constraint PK_SERVICE_YJNC_TASKS primary key (ID);

