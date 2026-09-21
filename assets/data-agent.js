/* Wide Thought Host（Agent）项目数据 */
window.DATA_AGENT = {
  id: 'agent',
  name: 'Wide Thought Host',
  en: 'Open-source AI Coding Agent',
  color: 'var(--agent)',
  colorHex: '#a16207',
  path: 'D:\\gork\\wth',
  repo: 'https://github.com/Wan-1230/Wide-Thought-Host',
  live: '',
  blurb: 'xAI Grok Build 的隐私向社区发行版（VSCodium 式 fork），我是维护者：162 次提交（全仓 200）、净增约 7.5 万行 Rust。CLI（ratatui TUI）+ Desktop（Tauri 2）双形态，多模型路由、子智能体委派、MCP 双向接入、权限审批治理。我负责的段落：包名体系迁移（62 个 xai-* → wth-*）、Desktop 内核统一、wth mcp-serve 反向暴露、跨平台打包 CI 与隐私出口门禁。v2.1.0 已发布。',
  tags: ['Rust', 'Tauri', 'ratatui', 'Agent', 'MCP', '多模型路由', '权限治理', '开源 fork 维护'],
  overview: {
    stack: [
      ['Rust (edition 2024)', '核心语言：性能 + 内存安全，Agent 内核与工具全部用它写'],
      ['Tauri 2.x', '桌面壳：界面用 Web 技术（React/TS），底层是 Rust，体积小省内存'],
      ['ratatui + crossterm', 'CLI 全屏 TUI：终端里的多面板交互界面'],
      ['tokio + async-trait', '异步运行时：所有 LLM 调用、工具执行都在协程上'],
      ['async-openai / reqwest / eventsource-stream', 'LLM 接入层：三种协议的 HTTP + SSE 流式调用'],
      ['rmcp 2.1', 'MCP（Model Context Protocol）官方 Rust SDK，隔离在独立 crate 里'],
      ['SQLite FTS5 + sqlite-vec', '记忆检索双引擎：关键词全文 + 向量近邻'],
      ['gix / async-lsp', 'Git 操作与语言服务器协议（代码智能）'],
    ],
    numbers: [
      ['162 次', '我的提交（全仓 200），净增约 7.5 万行'],
      ['76 个', 'crate 目录（workspace members 81，依赖表 231 条）'],
      ['32 类', '内置工具（ToolKind 共 33 个 variant，含 Other）'],
      ['3 种', '线协议后端（ChatCompletions / Responses / Messages）'],
      ['4 档', 'Desktop 审批档位 edit_mode（plan/review/auto/yolo）；内核与 TUI 是另一套 default/ask/auto/always-approve'],
      ['2.4 万处', '测试断言 #[test]（1266 个含测试文件、324 个集成测试、9 个 bench）'],
    ],
    refs: [
      { name: 'Tauri（tauri-apps/tauri）', url: 'https://github.com/tauri-apps/tauri', why: '桌面应用框架本体，对照理解 Desktop 形态的架构' },
      { name: 'ratatui', url: 'https://github.com/ratatui/ratatui', why: 'TUI 库，看 examples 就能做出多面板终端界面' },
      { name: 'MCP 官方（modelcontextprotocol）', url: 'https://github.com/modelcontextprotocol/servers', why: 'MCP 协议与官方服务器集合，理解「AI 的 USB-C」' },
      { name: 'OpenHands', url: 'https://github.com/All-Hands-AI/OpenHands', why: '最流行的开源自主编码 Agent，对照 WTH 的工具与权限设计' },
      { name: 'aider', url: 'https://github.com/Aider-AI/aider', why: '经典 AI 结对编程 CLI，看它的 repo-map 思路' },
    ],
    flow: ['用户输入任务', 'Agent 规划（Plan：拆解 + 风险预判）', '选择工具（Shell / 文件 / Git / LSP / MCP）', '权限审批（按 Plan/Review/Auto/YOLO 决策）', '执行并把结果回传上下文', '循环直到 Verify 通过', '子任务可委派给子智能体并行执行'],
  },
  modules: [
    {
      id: 'agent-1', title: 'Agent 是什么：从「会聊天」到「会干活」', level: '入门', minutes: 15,
      keywords: 'agent 智能体 工具调用 plan execute verify 循环',
      summary: '聊天机器人只输出文字；Agent 会自己规划步骤、调用工具（读文件、跑命令、查 Git）、看结果、再决定下一步——循环直到任务完成。WTH 的源码注释说得极好：Agent = definition（定义）+ session context（会话上下文）。',
      sections: [
        { h: 'Agent 循环的五步', body: `<ol>
<li><b>Plan</b>：理解目标 → 拆解子任务 → 预判风险（哪些操作有副作用）→ 规划工具调用顺序</li>
<li><b>Execute</b>：按计划调用工具，每一步结果回传，支持动态调整</li>
<li><b>Observe</b>：工具输出进入上下文，模型「看到」发生了什么</li>
<li><b>Verify</b>：跑测试 / 语法检查 / 让模型自检产出；不通过则带着报错重新迭代</li>
<li><b>交付</b>：汇总结果给用户</li></ol>
<p>这个循环的每一圈 = 一次 LLM 调用 + 若干次工具调用。所以 Agent 产品的两大经营指标是<b>步数（成本）</b>和<b>成功率（价值）</b>。</p>` },
        { h: '工具调用（Tool Use）是怎么发生的', body: `<p>模型本身只会输出 JSON，不会真的执行。流程是：</p>
<ol><li>请求里附上「工具清单」（每个工具的名字、描述、JSON Schema 参数定义）</li>
<li>模型决定「我要调 bash 工具，参数是 ls -la」，输出一个结构化调用</li>
<li><b>运行时（你的代码）真正执行它</b>，把结果作为消息回传</li>
<li>模型看到结果，继续下一步——周而复始</li></ol>
<p>关键认知：<b>执行权在你手里，不在模型手里</b>。这就是为什么权限控制（第 4 课）在架构上可行。</p>` },
      ],
      pmNote: 'Agent 产品的核心交付物之一是评测体系（Eval-First）：任务完成率、工具调用正确率、平均步数/成本/人工审批率。先建评测集，再谈迭代——否则「A 场景变好、B 场景变坏」你都看不见。',
      hook: '面试答「Agent 是什么」不要背定义，直接讲循环：Plan → Execute → Verify + 工具调用，然后落到产品视角——「审批策略是这个循环的安全阀」，把技术和治理串起来。',
      refs: [
        { name: 'OpenHands', url: 'https://github.com/All-Hands-AI/OpenHands', why: '开源自主 Agent 的标杆实现，和 WTH 对照看循环与沙箱' },
        { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', why: '业界最经典的 Agent 设计短文，工作流 vs Agent 的分界讲得极清楚' },
      ],
    },
    {
      id: 'agent-2', title: 'Rust 与 Tauri：为什么选它们', level: '入门', minutes: 15,
      keywords: 'rust 所有权 crate workspace tauri tui ratatui',
      summary: 'WTH 用 Rust 写内核有两个理由：Agent 要跑不受控的长任务（内存安全 = 不崩）；要处理大量并发 IO（性能）。桌面壳用 Tauri：界面用熟悉的 Web 技术，底层是 Rust，安装包比 Electron 小一个数量级。',
      sections: [
        { h: 'Rust 三个够用的概念', body: `<ul>
<li><b>所有权（Ownership）</b>：每个值有唯一的主人，赋值/传参默认「移动」而非拷贝，离开作用域自动释放。编译期就消灭了内存泄漏和悬垂指针——对跑几小时无人值守任务的 Agent 是刚需。</li>
<li><b>Crate 与 Workspace</b>：crate = 编译单元（≈ 一个包）。WTH 有 76 个 crate 目录组成 workspace（members 81），按「采样器 / 工具 / MCP / 记忆 / 配置」拆开，改一处只重编译一处。</li>
<li><b>Trait</b>：≈ 接口。所有工具实现同一个 Tool trait，Agent 循环不关心具体是 Shell 还是 Git——多态在这里。</li></ul>` },
        { h: '双形态如何共享一个内核', body: `<ul>
<li><b>CLI</b>：ratatui 画全屏 TUI（多面板、内置终端），走完整的 wth-agent 内核 + 全部工具</li>
<li><b>Desktop</b>：Tauri 2.x——前端 React/TS，Rust 后端通过 IPC command 暴露能力（列目录、跑工具、流式回传事件）</li>
<li>两者共享同一套 Agent 定义与工具协议（用 ts-rs 把 Rust 类型自动生成 TS 类型，前端不用手抄接口）</li></ul>
<p>命名考古：仓库里 xai-grok-* 是历史前缀（项目基于 Apache-2.0 的 grok-build 定制），wth-* 是新名字，读源码时把两者当同一套东西。</p>` },
      ],
      pmNote: '「CLI + Desktop 双形态共享内核」本身是产品决策：开发者先在终端用起来（分发成本零），重交互用户要 GUI（可视化审批、文件树）。一套内核两种皮，维护成本可控。',
      hook: '面试不必能写 Rust，但要能说清「为什么是 Rust」：长时无人值守任务要内存安全、并发 IO 要性能、Tauri 比 Electron 轻。三个理由足矣。',
      refs: [
        { name: 'Tauri', url: 'https://github.com/tauri-apps/tauri', why: '官方文档的「Why Tauri」一节，和 Electron 的对比数据很直观' },
        { name: 'The Rust Book', url: 'https://doc.rust-lang.org/book/', why: '官方教程，前 4 章就能看懂所有权和 trait' },
        { name: 'ratatui', url: 'https://github.com/ratatui/ratatui', why: '看 examples 目录，10 分钟理解 TUI 的组件模型' },
      ],
    },
    {
      id: 'agent-3', title: '工具系统：Agent 的手', level: '进阶', minutes: 18,
      keywords: 'tool trait 工具 json schema 注册 桥接 tool family',
      summary: '所有工具实现同一个 Tool trait：声明参数类型（自动生成 JSON Schema 给模型看）和输出类型；实现 run（简单阻塞）或 execute（流式）。Shell、文件读写、Git、LSP、网页搜索、子智能体……对 Agent 循环来说都是同一个接口。',
      sections: [
        { h: '统一 Tool trait（精简版源码）', body: ``, code: [
            { lang: 'rust', file: 'crates/common/wth-tool-runtime/src/tool.rs', lines: 'L32–105（节选）', code: `pub trait Tool: Send + Sync {
    // 参数类型：自动反序列化 + 生成 JSON Schema（给模型看的说明书）
    type Args: for<'de> Deserialize<'de> + JsonSchema + Send + 'static;
    type Output: Serialize + ToolOutput + Send + 'static;

    fn id(&self) -> ToolId;
    fn description(&self, _ctx: &ListToolsContext) -> ToolDescription;
    fn should_list(&self, _ctx: &ListToolsContext) -> bool { true }

    // 运行时只调 execute（流式）；简单工具只实现 run，默认实现帮你包装
    fn execute(&self, ctx: ToolCallContext, args: Self::Args)
        -> impl Future<Output = ToolStream<Self::Output>> + Send { ... }
    fn run(&self, _ctx: ToolCallContext, _args: Self::Args)
        -> impl Future<Output = Result<Self::Output, ToolError>> + Send { ... }
}`, explain: '教学点：Args 用关联类型 + JsonSchema——「参数说明书」不是手写文档，而是从类型自动生成，永不和实现脱节。这是 Rust 类型系统给 Agent 的红利。' },
          ] },
        { h: '工具从哪来：内置 + MCP 两路汇合', body: `<ul>
<li><b>内置工具</b>：bash、read_file、grep、search_replace、web_search、lsp、task（子代理）、todo 等 20+，注册进 ToolBridge</li>
<li><b>MCP 工具</b>：bridge.rs 的 register_mcp_tools 把外部 MCP 服务器的工具「翻译」成同样的 Tool trait 注册进来——Agent 循环完全无感</li>
<li><b>ToolFamily</b>：工具按能力分类（只读 / 写文件 / 执行命令…），权限层按家族设门槛</li></ul>
<p>这是个标准的设计模式案例：<b>新增一个工具 = 实现一个 trait + 注册一行，Agent 主循环零改动</b>。</p>` },
      ],
      pmNote: '工具的 description 写得好不好，直接影响模型选对工具的概率——工具描述本身就是一种「面向模型的 UI 文案」，是 AI PM 能直接出力的地方。',
      hook: '面试讲工具系统抓两点：① 类型安全（Schema 从类型生成）；② 开放性（MCP 工具与内置工具走同一接口，即插即用）。',
      refs: [
        { name: 'JSON Schema', url: 'https://json-schema.org/', why: '工具参数说明书的标准格式，所有模型 Function Calling 的共同语言' },
        { name: 'Anthropic Tool Use 文档', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', why: '看模型侧如何「选择并调用」工具，补全流程另一半' },
      ],
    },
    {
      id: 'agent-4', title: '权限控制：Plan / Review / Auto / YOLO', level: '进阶', minutes: 18,
      keywords: '权限 审批 零信任 提示注入 安全 yolo gitrisk',
      summary: 'Agent 能跑命令、删文件，安全边界怎么定？WTH 把「风险偏好」做成用户可配置的产品参数：Plan（只读规划）/ Review（逐次审批）/ Auto（低风险自动）/ YOLO（全自动）。决策函数只有 28 行，却是整个项目「安全作为产品约束」的浓缩。',
      sections: [
        { h: '决策函数：模式 × 工具 × 参数风险', body: ``, code: [
            { lang: 'rust', file: 'crates/desktop/wth-desktop/src/ipc/tools.rs', lines: 'L172–199', code: `/// 判断某个工具调用是否需要用户确认。
pub fn needs_approval(tool_name: &str, arguments: &Value, edit_mode: &str) -> bool {
    let read_only = matches!(
        tool_name,
        "file_read" | "file_list" | "file_search" | "web_search"
    );
    if read_only { return false; }              // 只读工具：一律放行
    if edit_mode == "yolo" { return false; }    // YOLO：全放行
    match tool_name {
        // 低风险写操作：auto 自动执行，plan/review 需确认
        "file_write" | "file_edit" => edit_mode != "auto",
        // 高风险操作：除 yolo 外一律确认
        "bash" | "file_delete" => true,
        "git" => {
            let args = git_arg_strings(arguments);
            match git_risk(&args) {             // Git 按参数分三级
                GitRisk::ReadOnly => false,     //   git status / diff
                GitRisk::Write => edit_mode != "auto",  // git commit
                GitRisk::Dangerous => true,     //   git push / reset --hard
            }
        }
        _ => true,                              // 陌生工具默认要审批
    }
}`, explain: '教学点：三要素正交决策——用户模式决定「松紧」，工具与参数决定「风险等级」；只读短路放行保效率，陌生工具默认要审批保安全（默认拒绝原则）。' },
          ] },
        { h: '为什么这套设计是对的（零信任 Agent 原则）', body: `<ul>
<li><b>不信任模型输出</b>：模型可能被「间接提示注入」——恶意指令藏在网页、邮件、代码注释里，Agent 一读就会被放大执行（2026 年 Agent 最大威胁 AIjacking）</li>
<li><b>不继承无限权限</b>：子智能体的工具范围独立配置，按需最小化</li>
<li><b>不默认执行副作用</b>：写操作默认要确认，除非用户明确授权</li>
<li><b>凭证不进上下文</b>：API Key 存 Windows 凭据管理器，模型永远「看不见」密钥</li></ul>
<p>审批事件还接了 Hook（tool_approved / tool_denied），所有决策留痕可审计——这是企业客户敢用的前提。</p>` },
      ],
      pmNote: '审批粒度 = 用户效率与安全感的平衡器，本质是产品参数而非技术开关。把权限模式做成四个用户看得懂的档位，是「概率型系统的产品化」的最佳案例。',
      hook: '面试答「Agent 安全怎么保证」：先讲威胁（提示注入、误执行），再讲零信任四原则，最后落到 WTH 的四档审批 + Git 风险分级 + 凭据隔离 + 审计 Hook。有框架有落地。',
      refs: [
        { name: 'OWASP LLM Top 10', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', why: 'LLM 应用安全威胁的标准清单，提示注入排第一' },
        { name: 'MCP 安全讨论', url: 'https://modelcontextprotocol.io/docs/getting-started/security', why: '官方对 MCP 工具安全边界的建议' },
      ],
    },
    {
      id: 'agent-5', title: '多模型路由：模型是参数，不是信仰', level: '进阶', minutes: 18,
      keywords: '多模型 路由 api backend 适配器 重试 指数退避 成本',
      summary: '不同任务该配不同模型：简单问答用便宜小模型，复杂重构才用顶级模型，隐私敏感就走本地 Ollama。WTH 把「模型」抽象成可替换参数：统一接入层 + 三种线协议适配器 + 分级重试策略。',
      sections: [
        { h: '三种线协议的抽象轴', body: `<p>市面上模型厂商很多，但请求的「线协议」形态只有三种。每个模型在模型目录里声明自己的 api_backend 字段，路由层按此分发：</p>`, code: [
            { lang: 'rust', file: 'crates/codegen/xai-grok-sampling-types/src/types.rs', lines: 'L1012–1030', code: `pub enum ApiBackend {
    /// OpenAI Chat Completions（/v1/chat/completions）
    /// DeepSeek、Ollama 等 OpenAI 兼容端点都走这里
    #[default]
    ChatCompletions,
    /// OpenAI Responses API（/v1/responses）
    Responses,
    /// Anthropic Messages（/v1/messages）
    Messages,
}`, explain: '教学点：不管 OpenAI / Claude / DeepSeek / Ollama 有多少家，线协议只有这三种形态。每个模型在目录里声明自己的 api_backend，路由层按此分发。' },
          ] },
        { h: '适配器模式：把三种流归一成一种', body: `<p>每个协议有一个流解析器，把各自的 SSE 事件翻译成统一的内部事件流，下游收集逻辑完全无感——新增一家模型厂商 = 新增一个适配器文件：</p>`, code: [
            { lang: 'rust', file: 'crates/codegen/xai-grok-sampler/src/client.rs', lines: 'L1970–1994（节选）', code: `let result = match self.api_backend() {
    ApiBackend::ChatCompletions => {
        let (raw, meta) = self.conversation_stream(request).await?;
        let events = crate::stream::stream_chat_completions(raw, meta, request_id, idle_timeout);
        crate::stream::collect_response(events).await
    }
    ApiBackend::Responses => { /* 同样套路：stream_responses 适配 */ }
    ApiBackend::Messages  => { /* stream_messages 适配 */ }
};`, explain: '教学点：适配器模式 + 归一化事件流。子智能体可以各自配置模型——「每个任务用最合适的模型」在架构上就是一个字段。' },
          ] },
        { h: '重试与容错：概率型系统的基本功', body: `<ul>
<li><b>5xx / 连接错误</b>：可重试，指数退避（上限 15 次、单次封顶 30 秒）</li>
<li><b>429 限流</b>：单独阈值（2 次），避免火上浇油</li>
<li><b>4xx 认证 / 参数错误</b>：立即失败——重试没有意义，早失败早暴露</li>
<li><b>413 请求过大</b>：剥离图片重试一次——「降级重试」</li></ul>
<p>再加多端点切换：同一模型配多个服务商端点，一个挂了切下一个。</p>` },
      ],
      pmNote: '2026 年行业已从「单一大模型通吃」转向模型分级路由：按难度分发任务可省 60–75% 推理成本。「能算账」是 AI PM 的新核心能力——每千次会话成本要进上线评审。',
      hook: '面试问「为什么做多模型路由」三个理由：任务-模型匹配（成本）、可用性容错（切换）、隐私与离线（本地 Ollama）。加分句：「模型是参数不是信仰——AI PM 要知道每个模型的边界」。',
      refs: [
        { name: 'Ollama', url: 'https://github.com/ollama/ollama', why: '本地模型运行时，OpenAI 兼容端点一行配置接入' },
        { name: 'OpenAI 兼容协议', url: 'https://platform.openai.com/docs/api-reference/chat', why: 'ChatCompletions 已成为事实标准，理解它 = 理解 80% 的模型接入' },
      ],
    },
    {
      id: 'agent-6', title: 'MCP：AI 应用的 USB-C', level: '进阶', minutes: 15,
      keywords: 'mcp 协议 stdio initialize tools/list tools/call 生态',
      summary: 'MCP（Model Context Protocol）是 Anthropic 提出的开放协议，统一 Agent 与外部工具/数据源的连接方式——像 USB-C：一次集成，处处可用。到 2026 年它已基本赢得 Agent-to-Tool 层（月下载近亿、公共服务器超 1 万，各大厂商原生支持）。',
      sections: [
        { h: '没有 MCP 的世界 vs 有 MCP 的世界', body: `<ul>
<li><b>没有</b>：接 GitHub 要写连接器、接数据库再写一个、每个 Agent 应用重复造轮子；权限逻辑散落各处</li>
<li><b>有</b>：工具方实现一次 MCP server，所有支持 MCP 的 Agent 直接用；Agent 方实现一次 client，全生态工具即插即用；权限在 MCP 层统一收口</li></ul>
<p>和 A2A（Agent2Agent，谷歌捐给 Linux 基金会）的关系：MCP 管「Agent ↔ 工具」，A2A 管「Agent ↔ Agent」，互补不竞争。</p>` },
        { h: 'WTH 桌面端的 MCP 客户端（手写精简版）', body: `<p>协议交互四步：启动服务器进程 → initialize 握手（10s 超时）→ tools/list 拿工具清单并入请求 → tools/call 执行（60s 超时）。CLI 完整版则用 rmcp SDK，支持 HTTP SSE + 子进程两种传输、OAuth 登录、SSE 断线退避重连。</p>
<p>值得学的工程细节：<b>任何一步失败自动降级跳过</b>——MCP 服务器挂了不能拖死整个 Agent，只是少了几个工具。</p>` },
      ],
      pmNote: 'MCP 之于 Agent 生态 = USB-C 之于外设：网络效应一旦形成，不支持 MCP 的工具生态会被边缘化。做 AI 产品时「要不要支持 MCP」在 2026 年已不是问题，问题是什么时候。',
      hook: '面试答「MCP 是什么」用 30 秒结构：一句话定义（AI 的 USB-C）→ 一句机制（server 暴露工具、client 发现并调用）→ 一句数据（月下载近亿、服务器超 1 万）→ 一句落地（WTH 用 MCP 扩展工具生态并统一走权限审批）。',
      refs: [
        { name: 'MCP 官网', url: 'https://modelcontextprotocol.io/', why: '协议规范 + 快速上手，理解 resources/tools/prompts 三原语' },
        { name: 'MCP 服务器集合', url: 'https://github.com/modelcontextprotocol/servers', why: '官方维护的参考实现（文件系统、Git、GitHub…），跑一个就全懂了' },
      ],
    },
    {
      id: 'agent-7', title: '子智能体：把大任务拆开并行干', level: '硬核', minutes: 20,
      keywords: 'subagent 子代理 委派 orchestrator worker 并行 上下文隔离',
      summary: '一个大任务（比如「重构整个模块」）拆成几个独立小任务，分给多个配置各异的子智能体并行执行，主 Agent 汇总结果。这是 Orchestrator-Worker 模式——2026 年多智能体系统的标准架构。',
      sections: [
        { h: '委派的协议：SubagentRequest', body: ``, code: [
            { lang: 'rust', file: 'crates/codegen/xai-grok-tools/src/implementations/grok_build/task/types.rs', lines: 'L29–68（节选）', code: `/// TaskTool 发出、协调者接收的请求
pub struct SubagentRequest {
    pub id: String,                    // 子代理 ID = 子会话 ID
    pub prompt: String,                // 子任务描述
    pub subagent_type: String,         // 角色（用哪套提示词）
    pub parent_session_id: String,
    /// 只取消「当前这轮」派生的子代理
    pub parent_prompt_id: Option<String>,
    /// 可从已完成子代理的会话恢复，省去重跑
    pub resume_from: Option<String>,
    pub runtime_overrides: SubagentRuntimeOverrides,  // 模型/提示词/工具范围独立配置
    /// 后台子代理在父轮取消后仍存活
    pub run_in_background: bool,
    pub fork_context: bool,
    /// 协调者通过 oneshot 通道回收结果
    pub result_tx: oneshot::Sender<SubagentResult>,
}`, explain: '教学点：文档注释即设计文档——为什么能按父轮取消、为什么能恢复、结果怎么回来，全写在字段注释里。嵌套深度限制 max 1（子代理不能再派孙代理），防止递归爆炸。' },
          ] },
        { h: '什么时候该拆？什么时候不该？', body: `<ul>
<li><b>该拆</b>：子任务相互独立（并行扫描 5 个目录、每个服务各改一个 bug）、需要隔离上下文（避免互相污染）、需要不同模型/工具组合</li>
<li><b>不该拆</b>：任务本质串行、子问题耦合强——强行多 Agent 只会增加成本与失败率</li>
<li><b>成本警示</b>：每个子代理都是独立的 LLM 循环，多 Agent 会放大 token 消耗，必须有预算控制（FinOps for Agentic AI）</li></ul>
<p>Gartner 预测 2027 年 70% 的多智能体系统将由「窄角色专业 Agent」组成——像微服务拆分一样拆 AI 角色。</p>` },
      ],
      pmNote: '子智能体的生命周期（创建/配置/委派/回收）每一步都可产品化：配置面板就是「给 Agent 发工牌」（能用哪些工具、用哪个模型、什么提示词）。「何时拆任务」是产品判断力的试金石。',
      hook: '面试答「什么时候需要多智能体」：只有任务能拆成相互独立的子问题时才值得——并举例（并行重构 + 各自测试），再补一句成本提醒，展现判断力而不是技术堆砌。',
      refs: [
        { name: 'Anthropic: Multi-agent research system', url: 'https://www.anthropic.com/engineering/built-multi-agent-research-system', why: '官方复盘 Orchestrator-Worker 的工程细节与坑' },
        { name: 'Tokio oneshot channel', url: 'https://docs.rs/tokio/latest/tokio/sync/oneshot/', why: '理解 result_tx 用的「一次性结果通道」原语' },
      ],
    },
    {
      id: 'agent-8', title: '记忆与上下文工程：别把历史全塞进去', level: '硬核', minutes: 20,
      keywords: '记忆 上下文工程 context rot fts5 sqlite-vec 混合检索 mmr 时间衰减',
      summary: '对话越长，模型越「糊」（context rot，上下文腐烂）。正解不是把全部历史塞进去，而是在正确时刻注入最相关的知识切片——这就是「上下文工程」。WTH 的记忆系统：关键词（FTS5）+ 语义（sqlite-vec 向量）双通道混合检索，外加时间衰减和多样性重排。',
      sections: [
        { h: '混合检索的三阶段设计', body: `<ol>
<li><b>阶段一（同步）</b>：FTS5 关键词检索——术语、代码标识符精确命中，还带 evergreen 补充（防全局记忆被会话量淹没）</li>
<li><b>阶段二（异步）</b>：查询向量用 Ollama 本地 Embedding——语义相近的也能召回</li>
<li><b>阶段三（同步）</b>：两路结果合并打分——时间半衰期（旧记忆自然降权）+ 来源权重 + MMR 多样性重排（避免 5 条全是同一个话题）</li></ol>
<p>存储布局：<code>~/.grok/memory/MEMORY.md</code> + 按工作区哈希（blake3(cwd)）分目录——<b>全本地、无遥测</b>，隐私友好。</p>` },
        { h: '上下文工程的产品含义', body: `<ul>
<li><b>分层</b>：记忆分「事实 / 偏好 / 执行历史」三层，注入时按任务相关性取</li>
<li><b>克制</b>：控制注入量（内核 memory.search.max_results 默认 6，Desktop 侧放宽到 20）——省成本，更防行为漂移</li>
<li><b>缓存</b>：提示词缓存让重复前缀只算一次钱，长系统提示 + 固定上下文的场景能省一大截</li></ul>
<p>行业趋势：从「提示词工程」（把指令写漂亮）到「上下文工程」（让正确的知识在正确的时刻出现），再往记忆图（Memory Graph）演进。</p>` },
      ],
      pmNote: '记忆系统的产品指标是「注入相关性」和「上下文预算」：每次会话平均注入多少 token、其中多少真正被用到。WTH 把它做成「关键词 + 语义自动升级」——用户不配置也能用，配了更好。',
      hook: '面试答「上下文工程」：先讲 context rot 现象（长上下文质量下降），再讲 WTH 双通道混合检索 + 分层记忆 + 限量注入，最后点题「这是成本与质量的双重优化」。',
      refs: [
        { name: 'sqlite-vec', url: 'https://github.com/asg017/sqlite-vec', why: '在 SQLite 里做向量检索的扩展，本地优先应用的检索标配' },
        { name: 'FTS5 文档', url: 'https://www.sqlite.org/fts5.html', why: 'SQLite 全文检索引擎，关键词通道的实现基础' },
      ],
    },
  ],
  quiz: [
    { q: 'Agent 循环的正确顺序是？', opts: ['Execute → Plan → Verify', 'Plan → Execute → Verify（不通过则迭代）', 'Verify → Plan → Execute', '只执行一次不需要循环'], a: 1, why: '先规划拆解与风险预判，再执行工具调用，最后验证产出；验证失败带着报错重新进入循环。' },
    { q: '模型「调用工具」时，真正执行工具的是？', opts: ['模型自己', '用户手动执行', 'Agent 运行时（框架代码）解析调用并执行，结果回传', '操作系统自动执行'], a: 2, why: '模型只输出结构化调用意图；执行权在运行时手里——这正是权限控制在架构上可行的原因。' },
    { q: 'needs_approval 里对「git push」这类操作的决策是？', opts: ['任何模式都放行', 'GitRisk::Dangerous → 除 YOLO 外一律要人工确认', '只要 auto 模式就放行', '由模型自行决定'], a: 1, why: 'Git 操作按参数分三级：只读放行、commit 看模式、push/reset --hard 等危险操作除 YOLO 外必须确认。' },
    { q: 'WTH 的三种线协议后端不包括？', opts: ['OpenAI ChatCompletions', 'Anthropic Messages', 'OpenAI Responses', 'gRPC Streaming'], a: 3, why: 'ApiBackend 只有 ChatCompletions / Responses / Messages 三种；所有 OpenAI 兼容厂商（DeepSeek/Ollama）都走第一种。' },
    { q: '对 4xx 认证错误的重试策略是？', opts: ['指数退避重试 15 次', '单独阈值重试 2 次', '立即失败（重试无意义）', '切换端点后无限重试'], a: 2, why: '5xx/连接错误可退避重试，429 限流单独阈值，认证/参数类 4xx 立即失败——把重试预算花在有用的地方。' },
    { q: 'MCP 解决的核心问题是？', opts: ['让模型更快生成文本', '统一 Agent 与工具/数据源的连接方式，一次集成处处可用', '模型训练加速', '替代 HTTP 协议'], a: 1, why: 'MCP 是「AI 的 USB-C」：工具方实现一次 server，所有 Agent 可用；权限也能在这一层统一收口。' },
    { q: '什么场景才值得拆分子智能体？', opts: ['任何任务都拆，多多益善', '子任务相互独立可并行、或需要上下文隔离时', '模型不够聪明时', '想节省 token 时'], a: 1, why: '任务可拆分独立才值得；强行多 Agent 会放大 token 消耗并增加失败率——「何时拆」是产品判断力。' },
    { q: '「上下文工程」的核心思想是？', opts: ['把所有历史记录塞进提示词', '在正确时刻注入最相关的知识切片，克制注入量', '提示词越长越好', '关闭对话历史'], a: 1, why: '对抗 context rot：分层记忆 + 相关性检索 + 限量注入（内核 6 条 / Desktop 20 条）+ 提示词缓存控制成本。' },
  ],
};
