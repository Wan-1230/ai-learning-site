/* N-Link（NikonLink）项目数据 */
window.DATA_NLINK = {
  id: 'nlink',
  name: 'NikonLink (N-Link)',
  en: 'Nikon Camera Companion App',
  color: 'var(--nlink)',
  colorHex: '#1e5fbb',
  path: 'D:\\1\\N-Link',
  repo: 'https://github.com/Wan-1230/N-link',
  live: '',
  blurb: '尼康 Z 系列微单「永不断联」伴侣 App，开源：连接 → 浏览 → 传输 → 遥控 → 监看 全链路已跑通，v2.3.1 已发布（102 个 Kotlin 文件 / 3.3 万行 / 122 个单元测试）。BLE 保活 + WiFi PTP/IP + USB 三通道互备。AI 修图目前只有一份 Draft PRD，零代码。',
  tags: ['Kotlin', 'MVVM', 'BLE', 'PTP/IP', 'Room', 'Coroutines', '开源'],
  overview: {
    stack: [
      ['Kotlin 2.1.0', '安卓官方推荐语言：简洁、空安全、协程原生'],
      ['MVVM + ViewBinding', '界面 / 业务逻辑 / 数据 三层分离（XML 布局，非 Compose）'],
      ['Coroutines + StateFlow', '后台任务与响应式状态：传图不卡界面，状态自动更新'],
      ['Room 2.6.1', '本地数据库：传输历史、配对设备（含唯一索引去重 + 手写迁移）'],
      ['Hilt 2.53.1', '依赖注入：33 个 @Singleton 自动拼装，少写初始化代码'],
      ['BLE / PTP/IP / USB', '相机三通道：配对保活 / 高速传输 / 有线兜底'],
      ['WorkManager 2.10.0', '15 分钟周期健康检查，异常自愈'],
      ['minSdk 29 / target 35', 'Android 10 起（BLE 5.0 完整支持），目标 Android 15'],
    ],
    numbers: [
      ['v2.3.1', '已发布版本（versionCode 23，仓库 15 个 tag）'],
      ['3.3 万行', '102 个 Kotlin 文件，33,691 行'],
      ['122 个', '单元测试 @Test（21 个测试类，纯 JVM）'],
      ['3 通道', 'BLE 配对保活 + WiFi 高速 + USB 有线，互为兜底'],
      ['4 阶段', '尼康标准 BLE 配对协议（含 Blowfish 加密）'],
      ['1071 行', 'ConnectionManager 单文件——三通道编排全在这里'],
    ],
    refs: [
      { name: 'Now in Android（google/nowinandroid）', url: 'https://github.com/android/nowinandroid', why: 'Google 官方 MVVM 范例 App，学架构的首选开源项目' },
      { name: 'Nordic BLE Library', url: 'https://github.com/NordicSemiconductor/Android-BLE-Library', why: '业界最常用的 Android BLE 封装，对照理解 GATT 交互' },
      { name: 'libgphoto2', url: 'https://github.com/gphoto/libgphoto2', why: '开源相机 PTP 实现鼻祖，看它如何处理各厂商操作码' },
      { name: 'Android BLE 官方指南', url: 'https://developer.android.com/develop/connectivity/bluetooth/ble/ble-overview', why: 'GATT、扫描、连接的权威文档' },
    ],
    flow: ['BLE 扫描与 4 阶段配对（Blowfish 加密）', 'BLE 下发 WiFi 凭证 / mDNS 自动发现相机', '连接升级到 PTP/IP 高速通道（USB 有线优先兜底）', '前台服务保活 + 5 秒 BLE 心跳', '传输 / 遥控 / Live View / 参数（PTP 操作码）', '断线 → 状态机 → 指数退避重连（上限 30 秒；WiFi 直连另有 10 次尝试预算）', 'WorkManager 15 分钟健康检查兜底'],
  },
  modules: [
    {
      id: 'nlink-1', title: '安卓全景：Kotlin + MVVM 架构', level: '入门', minutes: 15,
      keywords: 'kotlin mvvm viewmodel 架构 hilt 分层 minsdk',
      summary: '安卓 App 的经典三层：UI 层（Fragment 画界面）→ ViewModel 层（业务逻辑 + 状态）→ 数据层（连接管理、数据库、仓库）。MVVM 的意义：界面只「显示状态」，逻辑都在 ViewModel，改界面不影响逻辑，屏幕旋转也不丢数据。',
      sections: [
        { h: 'N-Link 的包结构（按业务域分层）', body: `<ul>
<li><b>device/</b>：连接域——ble/、ptp/、usb/、wifi/ 三通道 + connect/ 连接管理 + service/ 保活服务</li>
<li><b>camera/</b>：gallery/（传输）、liveview/（监看）、params/（参数）三大功能</li>
<li><b>capture/</b>：遥控拍摄</li>
<li><b>shared/</b>：di/（依赖注入）、data/（数据库）、common/（通用工具）</li></ul>
<p>5 个 ViewModel 对应五大界面：Dashboard（连接仪表盘）、Transfer（照片传输）、RemoteShooting（遥控）、LiveView（监看）、CameraParams（参数）。全部用 <code>@HiltViewModel</code> 构造注入——依赖由 Hilt 自动拼装，不用手写初始化。</p>` },
        { h: '为什么 2026 年还用 XML 而不是 Compose？', body: `<p>本项目选了 XML + ViewBinding 而非 Jetpack Compose：硬件通信类 App 的界面复杂度集中在「连接状态仪表盘」和「照片网格」，成熟 View 体系 + Material Components 生态更稳；Compose 的优势（声明式 UI、动画）在此场景收益有限。技术选型跟着场景走，不追新——这本身就是值得讲的判断。</p>
<p>版本要点：minSdk 29（Android 10，保证 BLE 5.0 完整支持）、target 35；Kotlin 2.1.0 + KSP 注解处理（Room、Hilt 编译期生成代码，比老 kapt 快很多）。</p>` },
      ],
      pmNote: 'MVVM 对 PM 的意义：界面改版（View 层）和业务规则（ViewModel 层）可以分开迭代，互不牵连。读 PRD 时按「界面 → ViewModel 状态 → 数据来源」倒推，就能看懂技术方案。',
      hook: '面试被问「你们的 App 架构」：MVVM 三层 + 按业务域分包 + Hilt 注入 + StateFlow 状态流，两句话讲清，别陷入术语堆砌。',
      refs: [
        { name: 'Now in Android', url: 'https://github.com/android/nowinandroid', why: 'Google 官方架构范例，对照 MVVM 分层的最佳实践' },
        { name: 'Android 官方架构指南', url: 'https://developer.android.com/topic/architecture', why: 'UI Layer / Domain / Data Layer 的权威定义' },
      ],
    },
    {
      id: 'nlink-2', title: '状态管理：ViewModel + StateFlow + 协程', level: '进阶', minutes: 18,
      keywords: 'stateflow coroutines combine maplatest 协程 状态 屏幕旋转',
      summary: 'StateFlow 是「会通知订阅者的状态盒子」：界面订阅它，状态一变界面自动刷新。协程（Coroutines）让耗时任务（传图、连相机）不卡界面。两者组合 = 安卓响应式编程的核心。',
      sections: [
        { h: '多路状态合并成界面列表（真实源码）', body: `<p>照片页有三个状态源：相机里的照片、本地已下载的照片、当前相册来源。用 combine 合并 + mapLatest 派生过滤结果：</p>`, code: [
            { lang: 'kotlin', file: 'app/src/main/java/com/nikonlink/app/camera/gallery/TransferViewModel.kt', lines: 'L85–135（节选）', code: `// 三个流合并：相机照片 / 本地照片 / 相册来源 → 决定展示哪个列表
val displayedPhotos: StateFlow<List<CameraFile>> = combine(
    _photoList, _localPhotos, _activeAlbum
) { camera, local, source ->
    if (source == AlbumSource.CAMERA) camera else local
}.stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

// 先筛后排：过滤 + 排序派生流
val filteredPhotos: StateFlow<List<CameraFile>> = combine(
    displayedPhotos, _photoFilter, _sort, _isLoading
) { photos, filter, sort, loading ->
    SortInput(photos.filter { filter.matches(it) }, sort, loading)
}.mapLatest { input ->
    when {
        input.files.isEmpty() -> emptyList()
        input.loading -> input.files          // 加载中不重排，防闪烁
        else -> withContext(Dispatchers.Default) { sortCameraFiles(input.files, input.sort) }
    }
}.stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())`, explain: '教学点：mapLatest 会自动取消上一次还没算完的排序（用户连点排序按钮也不堆任务）；排序切到 Dispatchers.Default 后台线程，不卡主线程；「加载中不重排」是体验细节写进代码。' },
          ] },
        { h: '协程到底解决了什么', body: `<ul>
<li><b>不卡界面</b>：主线程只画界面，网络/蓝牙/数据库全部挂在后台协程，<code>suspend</code> 函数写起来像同步代码，实际是异步执行</li>
<li><b>生命周期安全</b>：viewModelScope 里的协程随页面销毁自动取消，不会内存泄漏</li>
<li><b>结构化并发</b>：父协程取消，所有子任务跟着取消——传图取消时，读数据的协程一并停</li></ul>
<p>旋转屏幕时 Activity 重建，但 ViewModel 和它的 StateFlow 还在——这就是「旋转不丢状态」的机制。</p>` },
      ],
      pmNote: 'StateFlow 的产品设计价值：状态驱动 UI 意味着「连接状态仪表盘」永远和真实状态一致——不存在「界面显示已连接但实际断了」的谎报。可靠性可被用户看见。',
      hook: '面试一句话：状态用 StateFlow 单向流动（数据层 → ViewModel → 界面），耗时任务用协程挂起不卡主线程，combine 派生组合状态。',
      refs: [
        { name: 'Kotlin Flow 官方文档', url: 'https://kotlinlang.org/docs/flow.html', why: 'Flow/StateFlow 的权威教程，重点看 combine 与 mapLatest' },
        { name: 'Kotlin 协程指南', url: 'https://kotlinlang.org/docs/coroutines-guide.html', why: '理解 suspend 与结构化并发' },
      ],
    },
    {
      id: 'nlink-3', title: 'Room：让数据「活」在本地', level: '入门', minutes: 12,
      keywords: 'room sqlite 数据库 entity dao migration 唯一索引 迁移',
      summary: 'Room 是安卓官方的 SQLite 封装：用注解定义表结构，编译期生成实现，配合 Flow 变成响应式数据源。N-Link 用它存传输历史和配对设备——离线也能查历史照片、重启自动重连配对设备。',
      sections: [
        { h: '实体定义：数据库层去重（真实源码）', body: ``, code: [
            { lang: 'kotlin', file: 'app/src/main/java/com/nikonlink/app/shared/data/NLinkDatabase.kt', lines: 'L19–66（节选）', code: `@Entity(
    tableName = "transfer_history",
    indices = [Index(value = ["file_handle"], unique = true)]  // 唯一索引
)
data class TransferRecord(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "file_handle") val fileHandle: Int,   // 相机里的文件编号
    @ColumnInfo(name = "file_name") val fileName: String,
    @ColumnInfo(name = "file_size") val fileSize: Long,
    @ColumnInfo(name = "local_path") val localPath: String,
    @ColumnInfo(name = "transfer_time") val transferTime: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "status") val status: String = "completed"
)

// 唯一索引生效后，同一 file_handle 的重复写入直接忽略（数据库层去重）
@Insert(onConflict = OnConflictStrategy.IGNORE)
suspend fun insert(record: TransferRecord)`, explain: '教学点：去重不在应用层写 if 判断，而是交给数据库唯一索引 + OnConflictStrategy.IGNORE——并发场景下也不会插入两条，可靠性由数据库保证。' },
          ] },
        { h: '数据库迁移：版本升级不丢数据', body: `<p>App 从 v1 升到 v2 时表结构要变（比如给 file_handle 加唯一索引）。Room 的 Migration 写明「从旧结构怎么变到新结构」：N-Link 的 MIGRATION_1_2 先把旧表备份 → 去重 → 建新表 + 唯一索引 → 回灌数据，失败则兜底清表。用户升级 App 后传输历史还在，这就是迁移的意义。</p>
<p>DAO 返回 <code>Flow&lt;List&lt;TransferRecord&gt;&gt;</code>：表一变，界面自动刷新——数据库也是响应式的一环。</p>` },
      ],
      pmNote: '「一次配对自动重连」「传输历史离线可查」这两个产品卖点，底层就是 paired_devices 和 transfer_history 两张表。数据设计直接决定功能上限。',
      hook: '面试讲 Room 抓两个点：唯一索引用数据库约束做去重（比应用层判断可靠）、Migration 保证版本升级数据不丢。',
      refs: [
        { name: 'Room 官方指南', url: 'https://developer.android.com/training/data-storage/room', why: 'Entity/DAO/Database 三件套与迁移的权威文档' },
      ],
    },
    {
      id: 'nlink-4', title: 'BLE：让相机和手机说上话', level: '进阶', minutes: 20,
      keywords: 'ble gatt 配对 blowfish 心跳 uuid 蓝牙 保活',
      summary: 'BLE（蓝牙低功耗）是「永不断联」的常驻通道：省电、可后台。N-Link 实现了尼康公开的 GATT 配置：扫描 → 4 阶段配对（Blowfish 加密）→ 下发 WiFi 凭证 → 5 秒心跳保活。竞品 SnapBridge 的「频断联」正是输在这一层。',
      sections: [
        { h: 'GATT：BLE 的「目录结构」', body: `<p>BLE 设备把它提供的能力组织成「服务 → 特征」的树，每个特征有 UUID，读写特征就是交互。尼康相机的关键服务：</p>
<ul>
<li><b>DE00 服务</b>：配对与控制的主服务</li>
<li><b>2000 特征</b>：认证/配对入口（4 阶段协议在这里跑）</li>
<li><b>2004 特征</b>：WiFi 凭证下发通道——配对成功后把 SSID/密码写给相机，手机直接连相机热点</li>
<li><b>2005 特征</b>：连接建立确认 · <b>2008</b>：LSS 控制点</li></ul>
<p><b>4 阶段配对协议</b>（0x01 发起 → 0x00 回执 → 0x03 → 0x02 收盐值 → 0x04 → 等 2008 最终确认 → 写入 32 字节客户端 ID），全程 Blowfish 加密——盐值参与密钥派生，配对凭据不在空中裸奔。这是逆向公开资料实现的，配套有 Blowfish 单元测试。</p>` },
        { h: '保活与心跳：竞品的「频断联」在这里被治好', body: `<ul>
<li><b>5 秒 RSSI 心跳</b>：定期读信号强度，连续 3 次失败判定掉线（比等系统回调快得多发现断联）</li>
<li><b>前台服务（Foreground Service）</b>：常驻通知栏 + WakeLock，防系统杀后台——SnapBridge「后台被杀」的反制</li>
<li><b>WorkManager 15 分钟健康检查</b>：前台服务万一被杀，周期任务负责唤醒重建（区分 WiFi 直连快速恢复 / BLE 兜底全量重连两种路径）</li>
<li><b>开机自启 BootReceiver</b>：重启后自动恢复连接</li></ul>` },
      ],
      pmNote: '「稳」不是一个功能而是一层设计：心跳（发现快）+ 前台服务（不被杀）+ 周期自愈（杀也能救）。竞品的四类根因（频断联/后台被杀/WiFi 脆弱/无自动重连）在这里逐一有对应解法。',
      hook: '面试讲 BLE 抓三个数字：4 阶段配对协议、5 秒心跳连续 3 次失败判掉线、前台服务 + WorkManager 双保险。能讲出「蓝牙碎片化」风险（各厂商 BLE 行为不一）更加分。',
      refs: [
        { name: 'Android BLE 指南', url: 'https://developer.android.com/develop/connectivity/bluetooth/ble/ble-overview', why: 'GATT 模型的权威解释' },
        { name: 'nRF Connect for Mobile', url: 'https://github.com/NordicSemiconductor/Android-nRF-Connect', why: '调试 BLE 的必备工具 App：扫描、看服务树、手动读写特征' },
        { name: 'Blowfish 密码算法', url: 'https://en.wikipedia.org/wiki/Blowfish_(cipher)', why: '尼康配对用的对称加密算法背景知识' },
      ],
    },
    {
      id: 'nlink-5', title: 'PTP/IP：和相机的「通用语言」', level: '硬核', minutes: 22,
      keywords: 'ptp ip iso 15740 操作码 事务 id 字节序 socket 图片传输 live view',
      summary: 'PTP（ISO 15740）是相机行业的工业协议——尼康、佳能、索尼都讲这门语言。PTP/IP 是它的网络版，跑在 TCP 15740 端口。传照片、遥控快门、Live View 全靠它。这一课让你看懂「App 怎么和硬件对话」。',
      sections: [
        { h: '协议包的手工编码：小端字节序（真实源码）', body: ``, code: [
            { lang: 'kotlin', file: 'app/src/main/java/com/nikonlink/app/device/ptp/PtpProtocol.kt', lines: 'L381–421', code: `data class CommandRequestPacket(
    val transactionId: Int,
    val operationCode: Int,
    val parameters: List<Int> = emptyList(),
    val dataPhase: Boolean = false
) : PtpPacket() {
    override val type = PtpConstants.PACKET_TYPE_COMMAND_REQUEST

    override fun toBytes(): ByteArray {
        val size = PtpConstants.PTP_IP_HEADER_SIZE + 4 + 2 + 4 + (parameters.size * 4)
        val buffer = ByteBuffer.allocate(size).order(ByteOrder.LITTLE_ENDIAN)
        buffer.putInt(size)                      // 4 字节包总长
        buffer.putInt(type)                      // 4 字节包类型
        buffer.putInt(if (dataPhase) 2 else 1)   // 1=无数据阶段 2=有
        buffer.putShort(operationCode.toShort()) // 2 字节操作码
        buffer.putInt(transactionId)             // 4 字节事务 ID
        parameters.forEach { buffer.putInt(it) }
        return buffer.array()
    }
}`, explain: '教学点：二进制协议 = 按字节布局精确摆放。小端序（低位字节在前）是 x86/网络硬件生态的约定；8 字节头（长度+类型）让接收方能「先读长度再读包」。' },
          ] },
        { h: '操作码：标准 + 厂商扩展的分层', body: `<ul>
<li><b>标准操作码</b>（ISO 15740 定义）：0x1001 GetDeviceInfo、0x1007 GetObjectInfo、0x101B GetPartialObject（断点续传的关键）……任何 PTP 相机都认</li>
<li><b>尼康厂商扩展</b>：0x9201 StartLiveView、0x9203 GetLiveViewImage、0x90C0 SDRAM 拍摄、0x90C7 CheckEvent——Live View 和遥控是尼康私有扩展，这正是「厂商 SDK 未公开需逆向」的风险来源</li></ul>
<p><b>事务（Transaction）模型</b>：每次操作 = 命令请求 → （数据阶段）→ 响应，用自增事务 ID 关联。双 Socket（命令/事件各一条）+ Mutex 串行化保证不乱序；收到响应时校验事务 ID，<b>丢弃过期响应</b>（stale response）——上一条超时的迟答不会污染当前操作。</p>` },
        { h: '45MP 大图怎么传：流式写盘', body: `<p>Z8/Z9 的 45MP 照片上百 MB。PtpSessionManager 的 sendCommandWithData 支持 sink 参数：数据包到达时直接写入输出流（边下边落盘），不在内存里攒完整图——内存占用恒定，且每包回调 onProgress 给界面画进度条。</p>` },
      ],
      pmNote: 'PTP 兼容性是 PRD 里前置识别的三大风险之一：不同机型固件对厂商扩展码的支持有差异，所以产品上「按机型适配清单」管理，先支持 Z50II/Z6III/Z8/Z9。',
      hook: '面试一句话讲 PTP/IP：相机行业的 ISO 15740 标准协议，跑在 WiFi 上、端口 15740；标准操作码 + 厂商扩展实现 Live View 和遥控；事务 ID 串行化 + 流式下载解决大图传输。',
      refs: [
        { name: 'ISO 15740 (PTP) 概览', url: 'https://en.wikipedia.org/wiki/Picture_Transfer_Protocol', why: '协议背景与包结构速览' },
        { name: 'libgphoto2', url: 'https://github.com/gphoto/libgphoto2', why: '读它的相机驱动表，理解 PTP 兼容性问题的真实规模' },
      ],
    },
    {
      id: 'nlink-6', title: '三通道互备与状态机：永不断联的工程', level: '硬核', minutes: 20,
      keywords: '状态机 指数退避 重连 三通道 usb wifi ble 保活',
      summary: 'BLE（常驻低功耗）+ WiFi（高速传输）+ USB（有线兜底）三条通道互为备份，由 308 行的状态机统一调度：断线 → 指数退避重连（1s 翻倍、上限 30s）。这一课有互动模拟器，亲手体验「永不放弃」是怎么跑的。',
      demo: 'backoff',
      sections: [
        { h: '六状态连接状态机（真实源码）', body: `<p>状态：DISCONNECTED → CONNECTING → BLE_CONNECTED → WIFI_UPGRADING → FULLY_CONNECTED，出错进 ERROR_WAITING_RETRY。状态转移写成纯函数（一张「状态 × 事件 → 新状态」的表），可测试、无隐藏分支：</p>`, code: [
            { lang: 'kotlin', file: 'app/src/main/java/com/nikonlink/app/device/connect/ConnectionStateMachine.kt', lines: 'L227–250', code: `/** PRD 3.3：指数退避重连调度，初始 1s，倍增因子 2，上限 30s，永不放弃 */
private fun scheduleRetry() {
    retryJob?.cancel()
    val delay = currentRetryDelay
    _retryCount.value++
    retryJob = scope?.launch {
        delay(delay)
        dispatch(ConnectionEvent.RetryTriggered)   // 到点再试一次
    }
    // 指数退避：翻倍但不超过上限
    currentRetryDelay = (currentRetryDelay * RETRY_MULTIPLIER).coerceAtMost(MAX_RETRY_DELAY_MS)
}

private fun resetRetry() {
    retryJob?.cancel()
    currentRetryDelay = INITIAL_RETRY_DELAY_MS     // 成功后归零
    _retryCount.value = 0
}`, explain: '教学点：为什么翻倍而不是固定 1 秒重试？相机还没缓过来时高频重试 = 重试风暴，反而拖垮恢复。上限 30 秒 = 最坏情况每 30 秒试一次，用户抬头时总能自动接上。注意分层：状态机层一直重试，但 WiFi 直连有自己的 10 次预算（1s/2s/4s/8s/15s×5，约 90 秒），连续 3 次不可达会提前放弃——「永不放弃」只在编排层成立，别讲成全局事实。' },
          ] },
        { h: '三通道怎么分工', body: `<ul>
<li><b>BLE</b>：常驻心跳 + 配对 + WiFi 凭证下发——「值班室」，功耗 &lt;3%/24h</li>
<li><b>WiFi（PTP/IP）</b>：mDNS 发现相机后升级，承担传输/Live View/遥控——「高速路」</li>
<li><b>USB</b>：有线直连，传输最快最稳——「应急车道」，WiFi 崩了插线即用</li></ul>
<p>ConnectionManager（731 行）负责编排：优先级调度、通道升级与回退、mDNS socket 绑定到 WiFi 网络（防蜂窝抢路由）。</p>` },
        { h: '保活四件套', body: `<ol>
<li><b>前台服务</b>：START_STICKY + WakeLock + CONNECTED_DEVICE 类型，常驻通知栏</li>
<li><b>WorkManager</b>：15 分钟周期健康检查，区分 4 种状态分别恢复</li>
<li><b>开机自启</b>：BOOT_COMPLETED 后自动重建连接</li>
<li><b>状态仪表盘</b>：连接状态机实时映射到通知栏与界面——「玄学断联」变成用户可见可诊断的状态</li></ol>` },
      ],
      pmNote: '「永不断联」是产品承诺，工程上是四层冗余：三通道互备 + 状态机调度 + 指数退避 + 周期自愈。把可靠性拆成可验收指标（恢复 &lt;3s、保持率 &gt;99%）才能管住它。',
      hook: '面试被问「连接稳定性怎么做到的」：先讲三通道分工，再讲状态机 + 指数退避（1s×2 上限 30s），最后讲保活四件套——结构化讲法，每个点都有数字。',
      refs: [
        { name: 'WorkManager 指南', url: 'https://developer.android.com/topic/libraries/architecture/workmanager', why: '周期任务与约束条件的官方方案' },
        { name: '前台服务类型', url: 'https://developer.android.com/develop/background-work/services/fg-service-types', why: 'Android 14+ 要求声明 connectedDevice/dataSync 等服务类型' },
      ],
    },
    {
      id: 'nlink-7', title: 'WiFi 发现与 USB 兜底', level: '进阶', minutes: 15,
      keywords: 'mdns nsd 组播 5353 usb bulk 端点 网络绑定',
      summary: '手机怎么在局域网里「发现」相机？mDNS 组播（224.0.0.251:5353）+ 子网端口扫描 + 系统 NSD 三路并发兜底。USB 则是最后防线：识别 STILL_IMAGE 接口，用 bulk 端点直接说 PTP。',
      sections: [
        { h: '三路并发的相机发现', body: `<ol>
<li><b>自绘 mDNS</b>：MulticastSocket 加入 5353 组播组，监听相机的服务广播——最标准</li>
<li><b>子网 15740 端口扫描</b>：32 并发 Semaphore 控速，直接探测 PTP/IP 端口——mDNS 被路由器吞了也能找到</li>
<li><b>系统 NSD</b>：注册 _ptp._tcp / _nikon._tcp 类型兜底</li>
<li>三路结果按 IP 去重合并——一个来源失败不影响发现</li></ol>
<p>实战坑（值得记住）：拿到 WiFi Network 后必须 <code>connectivityManager.bindSocket(socket, network)</code>——否则蜂窝网络会抢路由，组播包从错的路出去，mDNS 永远收不到。</p>` },
        { h: 'USB：最稳的兜底通道', body: `<ul>
<li>按 <b>VID 0x04B0</b>（尼康厂商 ID）+ STILL_IMAGE 接口类识别相机</li>
<li>找到 3 个端点：BULK OUT（发命令）/ BULK IN（收数据）/ INTERRUPT IN（收事件）</li>
<li>12 字节 PTP 容器头 + bulkTransfer 收发——和 PTP/IP 同一套操作码，只是换了传输层</li></ul>
<p>USB 的意义：传输速度天花板（WiFi 直连一般 20–40MB/s，USB 3.0 更高）+ 零干扰（不受路由器/信道影响）。</p>` },
      ],
      pmNote: '发现机制的「三路并发」是典型的可靠性设计：单点依赖（只用 mDNS）在真实家庭路由器环境会随机翻车。竞品「WiFi 切换脆弱」的根因之一就是只走单路。',
      hook: '面试一句话：mDNS 组播 + 端口扫描 + 系统 NSD 三路发现按 IP 去重；USB 用 STILL_IMAGE 接口 + bulk 端点跑同一套 PTP 协议做兜底。',
      refs: [
        { name: 'Android NSD 文档', url: 'https://developer.android.com/develop/connectivity/network-ops/nsd', why: '系统级 mDNS 服务发现的官方 API' },
        { name: 'USB Host 指南', url: 'https://developer.android.com/develop/connectivity/usb/host', why: 'bulkTransfer 与端点概念' },
      ],
    },
    {
      id: 'nlink-8', title: '端侧 AI 修图：从 PRD 到实现的完整规划', level: '进阶', minutes: 18,
      keywords: 'litert onnx 量化 int8 gpu delegate 端侧推理 kpi 灰度',
      summary: 'AI 修图是 Phase 4 规划（PRD 已完成、开发中）：在手机本地跑模型修图——隐私（照片永不上传）、离线（外拍无网）、成本（边际成本为零）。这一课学「PM 怎么把一个 AI 功能从想法变成可验证的方案」。',
      sections: [
        { h: '技术选型：为什么是 LiteRT / ONNX Runtime', body: `<ul>
<li><b>LiteRT（原 TensorFlow Lite）</b>：谷歌的端侧推理引擎，GPU Delegate 优先、NNAPI/CPU 兜底</li>
<li><b>ONNX Runtime</b>：跨框架通用引擎，训练侧用什么框架都能导出 .onnx</li>
<li><b>INT8 量化</b>：把模型权重从 32 位浮点压成 8 位整数——体积缩 4 倍、速度提 2–3 倍、精度损失可接受；PRD 约束总模型体积 ≤20MB、APK 增量 ≤30MB</li>
<li><b>三级回退</b>：GPU → NNAPI → CPU，推理失败则入口置灰降级（不崩、不卡、不阻塞传输主流程）</li></ul>
<p>边界认知：端侧 2B 级模型「确定性增强强（降噪/锐化/肤色/色彩）、开放式创作弱（换天空、语义编辑）」——所以 Phase 4 先做前者，语义编辑留作可选云端通道。</p>` },
        { h: '把 AI 功能变成可验证的产品（PRD 方法论）', body: `<ol>
<li><b>价值主张</b>：不是替代专业修图软件，而是「拍完 → 传输 → 一键修图 → 分享」的 30 秒出片闭环</li>
<li><b>北极星指标</b>：传输后 24h 内修图使用占比 &gt;30%</li>
<li><b>留存指标</b>：修图功能次周留存 &gt;40%</li>
<li><b>反向指标</b>：AI 不得拖慢传输成功率与连接保持率（增值功能不能伤核心体验）</li>
<li><b>验证路径</b>：灰度上线 → 看指标 → 达标全量 / 不达标复盘场景假设 → 敢用数据「杀掉」自己的功能</li>
<li><b>商业化</b>：基础滤镜免费 + 高级增强订阅（Freemium）</li></ol>` },
      ],
      warn: { title: '如实说明', body: '<p>当前 APK 中<b>没有</b>任何端侧推理代码（无 LiteRT/ONNX 依赖）——AI 修图是 PRD 阶段的完整规划。面试讲这个项目时要主动说「PRD 已完成、开发中」，把重点放在「场景挖掘 → 端侧/云端取舍 → KPI 定义」的规划能力上，这恰恰是 AI PM 的核心交付物。</p>' },
      pmNote: '这个案例展示了 AI PM 的多约束决策：推理成本、延迟、隐私、能力边界一起权衡。本地化不只是技术选择——「照片永不上传」变成了一句话讲清的信任资产。',
      hook: '面试答「为什么本地不上云」三连：隐私（最敏感数据）、离线（外拍无网）、成本（重度用户云端按张计费会失控）。再补诚实的取舍：复杂语义编辑本地方案暂时不行，先做确定性增强。',
      refs: [
        { name: 'LiteRT（原 TensorFlow Lite）', url: 'https://ai.google.dev/edge/litert', why: '端侧推理引擎官方文档，看 GPU Delegate 与量化章节' },
        { name: 'ONNX Runtime', url: 'https://onnxruntime.ai/', why: '跨平台推理引擎，理解模型格式标准化' },
        { name: '模型量化入门', url: 'https://huggingface.co/docs/optimum/concept_guides/quantization', why: 'INT8 量化的原理与精度权衡' },
      ],
    },
  ],
  quiz: [
    { q: 'N-Link 的三通道是指？', opts: ['WiFi / 蜂窝 / NFC', 'BLE / WiFi（PTP/IP）/ USB', '蓝牙经典 / 红外 / USB', 'BLE / NFC / WiFi'], a: 1, why: 'BLE 常驻配对保活、WiFi PTP/IP 高速传输、USB 有线兜底，互为备份。' },
    { q: '指数退避重连的参数是？', opts: ['固定每 1 秒重试', '初始 1s 翻倍、状态机层上限 30s 持续重试', '重试 3 次后永久放弃', '初始 30s 递减'], a: 1, why: '翻倍避免重试风暴，上限 30s 保证最坏情况下每 30 秒仍有尝试，永不放弃保证用户总能自动接上。' },
    { q: 'BLE 心跳的判定逻辑是？', opts: ['每 60 秒发一次消息', '5 秒一次 RSSI 心跳，连续 3 次失败判掉线', '等系统蓝牙断开回调', '用户手动刷新'], a: 1, why: '主动轮询信号强度比等系统回调更快发现断联，是「频断联被治好」的关键一环。' },
    { q: 'PTP/IP 跑在哪个端口？遵循什么标准？', opts: ['8080 端口 / HTTP', '15740 端口 / ISO 15740', '5353 端口 / mDNS', '443 端口 / TLS'], a: 1, why: 'PTP/IP 用 TCP 15740；协议本身是 ISO 15740 相机工业标准，尼康/佳能通用。' },
    { q: '传输历史表如何保证同一张照片不被重复记录？', opts: ['应用层 if 判断', '数据库唯一索引 + OnConflictStrategy.IGNORE', '每次清空表重写', '交给用户手动去重'], a: 1, why: 'file_handle 唯一索引把去重下沉到数据库层，并发插入也不会重复——约束比代码更可靠。' },
    { q: 'Live View 依赖的 0x9201 等操作码属于？', opts: ['ISO 15740 标准操作码', '尼康厂商私有扩展', '安卓系统 API', 'USB 协会标准'], a: 1, why: 'Live View/遥控是厂商扩展码，各机型固件支持有差异——这正是 PRD 识别的 PTP 兼容性风险。' },
    { q: 'mDNS 相机发现为什么要三路并发？', opts: ['为了更快', '单路依赖会随机翻车（组播被路由器吞、NSD 机型差异），三路互为兜底', '系统限制必须三个', '为了省电'], a: 1, why: '自绘 mDNS + 子网端口扫描 + 系统 NSD 按 IP 去重合并——真实家庭网络环境的可靠性设计。' },
    { q: '端侧 AI 修图选 INT8 量化的主要原因是？', opts: ['提高精度', '模型体积缩约 4 倍、速度提 2–3 倍、精度损失可接受', '兼容 iOS', '减少耗电'], a: 1, why: '量化让 2B 级模型在手机上「跑得动、算得快、装得下」（PRD 约束模型 ≤20MB），GPU/NNAPI/CPU 三级回退保兜底。' },
    { q: '（诚实题）AI 修图功能的当前状态是？', opts: ['已上线', '灰度中', 'PRD 已完成、开发中（APK 无推理代码）', '已砍掉'], a: 2, why: '当前无任何端侧推理代码；面试讲规划能力（场景→取舍→KPI），主动说明状态更显专业。' },
  ],
};
