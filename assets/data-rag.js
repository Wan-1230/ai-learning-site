/* AI 面试宝典（RAG）项目数据 */
window.DATA_RAG = {
  id: 'rag',
  name: 'AI 面试宝典',
  en: 'RAG Interview Platform',
  color: 'var(--rag)',
  colorHex: '#0c7d6f',
  path: 'D:\\1\\软件练习trae\\ai-resume-study',
  repo: 'https://github.com/Wan-1230/ai-resume',
  live: 'https://ai-interview-6rn.pages.dev',
  blurb: '基于 RAG 的智能面试平台：知识检索 → 智能问答 → 简历诊断 → 练习。独立完成 React/TS + Node/Express 全栈并上线。',
  tags: ['RAG', 'TF-IDF', 'SSE', 'React', 'Express', 'JWT/OAuth'],
  overview: {
    stack: [
      ['React 18 + TypeScript + Vite', '前端 SPA：页面、路由、组件化 UI'],
      ['Zustand', '轻量全局状态管理（登录态、用户信息）'],
      ['Tailwind CSS', '原子化样式，快速搭界面'],
      ['Node.js + Express', '后端服务：API 路由、认证、RAG 管道'],
      ['自实现 TF-IDF 内存检索', '向量存储 + 余弦相似度排序（MVP 检索器）'],
      ['openai SDK（兼容接口）', '调用 MiMo v2.5 大模型，支持流式'],
      ['SSE（Server-Sent Events）', '流式输出，优化首字延迟 TTFT'],
      ['JWT + GitHub OAuth', '自签发 Token + 第三方登录（手写 state 防 CSRF）'],
      ['Cloudflare Pages + Railway/Glitch', '前端 CDN 托管 + 后端云托管'],
    ],
    numbers: [
      ['279', '知识库文档块（文章切片 + 题目）'],
      ['1500 字', '单块上限（chunkContent）'],
      ['Top-5', '每次问题召回的相关片段数'],
      ['2000 字', '拼接进 Prompt 的上下文上限'],
      ['7 天', 'JWT 有效期'],
      ['10 分钟', 'OAuth state 防 CSRF 有效期'],
    ],
    refs: [
      { name: 'JavaGuide（Snailclimb/JavaGuide）', url: 'https://github.com/Snailclimb/JavaGuide', why: '本项目知识库语料来源，爬取 + 分块后入库' },
      { name: 'Chroma（chroma-core/chroma）', url: 'https://github.com/chroma-core/chroma', why: '最流行的开源向量数据库，升级路径的首选' },
      { name: 'LlamaIndex（run-llama/llama_index）', url: 'https://github.com/run-llama/llama_index', why: 'RAG 框架标杆：分块、索引、检索、生成的最佳实践都在里面' },
      { name: 'LangChain（langchain-ai/langchain）', url: 'https://github.com/langchain-ai/langchain', why: 'LLM 应用开发最常用框架，看它的 retriever 抽象' },
    ],
    flow: ['articles.json（JavaGuide 文章 URL）', 'crawl.js 爬取 + 分块（1500 字）', 'documents.json（279 块）', '启动时建 TF-IDF 索引（IDF 表）', '用户提问 → Top-5 召回', 'buildContext（2000 字）拼进 Prompt', 'MiMo v2.5 流式生成', 'SSE 逐字推给前端渲染'],
  },
  modules: [
    {
      id: 'rag-1', title: 'RAG 是什么：先查资料，再回答', level: '入门', minutes: 15,
      keywords: 'RAG 检索增强生成 幻觉 微调 可溯源',
      summary: 'RAG = Retrieval-Augmented Generation（检索增强生成）。一句话：让大模型先翻书、再答题——回答前先从资料库里找出最相关的几个片段，塞进提示词里，让模型「基于资料」作答。',
      sections: [
        { h: '大模型的三个毛病，RAG 逐一治', body: `<ul>
<li><b>知识有截止日期</b>：模型训练完就「封卷」，之后的新知识一概不知。RAG：换文档即更新知识，题库每周变也不用重新训练。</li>
<li><b>私有知识不知道</b>：你的面试题库、内部文章，模型从没见过。RAG：把私有资料放进检索库，模型现查现用。</li>
<li><b>幻觉</b>：不知道也硬编。RAG：要求「仅基于给定资料回答 + 标注来源」，用户可验证，幻觉显著下降。</li>
</ul>` },
        { h: 'RAG 的完整流水线（本项目实现版）', body: `<p>离线部分（数据准备）和在线部分（问答服务）两段：</p>
<ol><li><b>爬取</b>：crawl.js 用 cheerio 抓取 JavaGuide 文章，HTML 还原为 Markdown</li>
<li><b>分块（Chunking）</b>：每篇按段落贪心切成 ≤1500 字的片段</li>
<li><b>入库</b>：279 个文档块存进 documents.json，启动时加载建索引</li>
<li><b>检索（Retrieve）</b>：用户问题 → 向量化 → 和全库算余弦相似度 → 取 Top-5</li>
<li><b>拼接（Augment）</b>：5 个片段按格式拼成 2000 字上下的上下文</li>
<li><b>生成（Generate）</b>：连同样式约束的 System Prompt 一起交给 MiMo，流式生成</li></ol>
<p>记住这个口诀：<b>检索器（Retriever）和生成器（Generator）是分离的</b>——这正是后面能「只换检索器、升级向量库」而不动其他代码的原因。</p>` },
        { h: '为什么不用微调（Fine-tuning）？', body: `<ul>
<li><b>知识更新</b>：微调改的是模型「记忆」，换知识要重新训练；RAG 改的是「参考书」，换文档秒生效。</li>
<li><b>成本</b>：微调需要 GPU + 标注数据；几百篇文档的场景，微调 ROI 为负。</li>
<li><b>可溯源</b>：面试备考需要「答案有出处」；RAG 天然带引用，微调是黑盒记忆。</li>
<li><b>边界认知</b>：微调适合「风格迁移 / 格式固化 / 领域术语注入」，RAG 适合「外部知识问答」。两者互补不互斥。</li></ul>` },
      ],
      pmNote: 'RAG 的产品价值 = 可溯源 + 知识随时更新 + 数据不出库。判断一个场景该用 RAG 还是微调，看三件事：数据量、更新频率、要不要解释依据。',
      hook: '面试被问「为什么用 RAG」时，先讲场景（题库每周变、答案要可溯源），再讲成本（无训练），最后补一句边界认知（微调适合风格固化）——这一套是标准的高分答案。',
      refs: [
        { name: 'LlamaIndex', url: 'https://github.com/run-llama/llama_index', why: '把 RAG 五步流水线做到极致的框架，看文档 5 分钟建立全局感' },
        { name: 'JavaGuide', url: 'https://github.com/Snailclimb/JavaGuide', why: '本项目语料来源，可以对照「原始文章 → 279 个 chunk」的关系' },
      ],
    },
    {
      id: 'rag-2', title: '文档分块：把文章切成检索友好的片段', level: '入门', minutes: 12,
      keywords: 'chunking 分块 1500 重叠窗口 语义分块',
      summary: '为什么不能整篇文章直接检索？因为检索的最小单位就是块：块太大，相关关键词会被无关内容稀释，塞进 Prompt 也浪费 token；块太小，一句话上下文断裂、答非所问。分块是 RAG 调优的第一杠杆。',
      sections: [
        { h: '本项目的分块实现：按段落贪心拼接', body: `<p>策略很简单：文章超过 1500 字时，按空行分段落，然后像「装箱子」一样逐段装进当前块，装不下就封箱开新箱。题目则每题整篇作为一个块，不再切分。</p>`, code: [
          { lang: 'js', file: 'backend/scripts/crawl.js', lines: 'L176–200', code: `function chunkContent(text, maxChunkSize = 1500) {
  if (text.length <= maxChunkSize) return [text];
  const chunks = [];
  const paragraphs = text.split(/\\n\\n+/);   // 按空行分段
  let currentChunk = '';
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());       // 箱子满了，封箱
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\\n\\n' : '') + para;  // 否则继续装
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}`, explain: '教学点：maxChunkSize=1500 是按「中文文章 + 2000 字上下文预算」拍的经验值；按段落切保证了块的语义完整性（不会把一句话切成两半）。' },
        ] },
        { h: '分块策略的演进路线（面试常考）', body: `<ol>
<li><b>固定长度切</b>：每 500 字硬切。最简单，但会拦腰斩断语义。</li>
<li><b>段落贪心 + 重叠窗口</b>：按段落切，相邻块重叠 10–20%，防止关键句恰好被切在边界上。</li>
<li><b>语义分块</b>：按标题层级 / 主题句切分，让每块是一个完整小主题。</li>
<li><b>父子分块</b>：检索用小块（准），喂给模型时带父块（全）。LlamaIndex 叫 small-to-big。</li></ol>` },
      ],
      pmNote: '改分块策略 = 改检索质量的第一个旋钮，而且成本为零。但要配评测集：改完跑一遍 50 个典型问题的回归，防止「修好了 A 场景、弄坏了 B 场景」。',
      hook: '面试讲分块，报数字：1500 字上限、按段落贪心、279 块语料。然后主动说演进路径（重叠窗口 → 语义分块），体现「知道现在在哪、下一步去哪」。',
    },
    {
      id: 'rag-3', title: 'TF-IDF 与余弦相似度：检索的数学直觉', level: '进阶', minutes: 20,
      keywords: 'TF-IDF IDF 余弦相似度 向量 检索排序',
      summary: 'TF-IDF 用一个直觉衡量「哪个词最能代表这篇文章」：在这篇文章里常出现（TF 高），同时在全库里很少见（IDF 高）的词，权重最大。两篇文章像不像，就看它们的高权重词像不像——用余弦相似度打分。',
      sections: [
        { h: '三分钟手算一遍', body: `<p>假设库里有 100 篇文档：</p>
<ul><li>「面试」出现在 80 篇里 → IDF = log(100/81) ≈ 0.09，太常见，区分度低</li>
<li>「LoRA」出现在 2 篇里 → IDF = log(100/3) ≈ 1.51，稀缺词，区分度高</li>
<li>某篇文档里「LoRA」出现 4 次、全文共 40 词 → TF = 4/40 = 0.1 → 该词权重 = 0.1 × 1.51 = 0.151</li></ul>
<p>每篇文档 = 一个「词 → 权重」的稀疏向量；IDF 表在启动时全库扫一遍建好。查询时把问题也变成向量，逐一算相似度。</p>`, code: [
            { lang: 'js', file: 'backend/rag/vectorstore.js', lines: 'L58–102', code: `tokenize(text) {
  // 简单分词：去掉标点，按空白切，保留英文单词和连续中文串
  return text.toLowerCase()
    .replace(/[^\\w\\u4e00-\\u9fa5]+/g, ' ')
    .split(/\\s+/).filter(t => t.length > 0);
}
tfidfVector(text) {
  const terms = this.tokenize(text);
  const tf = new Map();
  for (const term of terms) tf.set(term, (tf.get(term) || 0) + 1);
  const vector = new Map();
  for (const [term, count] of tf) {
    const tfidf = (count / terms.length) * (this.idf.get(term) || 0);
    vector.set(term, tfidf);                 // 稀疏向量：词 → 权重
  }
  return vector;
}
cosineSimilarity(vec1, vec2) {
  let dotProduct = 0, norm1 = 0, norm2 = 0;
  for (const [term, value] of vec1) {
    if (vec2.has(term)) dotProduct += value * vec2.get(term);  // 只算公共词
    norm1 += value * value;
  }
  for (const [, value] of vec2) norm2 += value * value;
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));   // 夹角余弦
}`, explain: '教学点：IDF 表启动时算好（idf = log(N/(1+df))，+1 防止除零）；余弦只累加两向量共有的词；最后除以两个模长归一化，结果 ∈ [0,1]。' },
          ] },
        { h: '实现里的两个「诚实的坑」', body: `<ul>
<li><b>没有真正的中文分词</b>：正则把连续无标点的中文整句当成一个 token。「什么是注意力机制」是一整个词。好在标题和术语（RAG、Agent）能命中，检索才基本可用——这是该方案的质量上限。</li>
<li><b>每次查询都对全库重新向量化</b>：279 篇无所谓，百万级就要预计算 + 倒排索引 / ANN。</li></ul>
<p>这两个坑在下一个模块的互动实验里可以亲手验证。</p>` },
      ],
      pmNote: 'TF-IDF 方案的优势是零服务、零成本、完全可控，MVP 三周就能上线；代价是检索只认「字面」，同义改写就抓瞎。什么时候升级？评测集上召回率不达标时。',
      hook: '面试被问「为什么不用向量数据库」，标准答法是选型故事：评估过 ChromaDB → MVP 数据量小、TF-IDF 够用 → 零部署成本、迭代快、中文处理可定制 → 检索器/生成器模块化分离，升级只换 retriever。',
      refs: [
        { name: 'rank_bm25', url: 'https://github.com/dorianbrown/rank_bm25', why: 'BM25 是 TF-IDF 的工业加强版，看几行实现就能懂稀疏检索' },
        { name: 'scikit-learn TfidfVectorizer', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html', why: '官方文档里「TF-IDF 数学定义 + 为什么用 log」讲得最清楚' },
      ],
    },
    {
      id: 'rag-4', title: '互动实验：亲手跑一遍检索', level: '入门', minutes: 10,
      keywords: '实验 demo 分词 bigram 对比 检索模拟',
      summary: '下面是一个真实运行的 TF-IDF 检索模拟器：6 篇迷你文档，输入一个问题，看它怎么被分词、加权和排序。重点看两个版本的对比——「整句中文当一个 token」（本项目实现）和「中文二元切分（bigram）改进版」。',
      demo: 'tfidf',
      sections: [
        { h: '实验怎么玩', body: `<ol>
<li>输入查询，比如 <code>RAG 怎么降低幻觉</code>，点「检索」。</li>
<li>先看「分词结果」：注意版本 A 把整段中文连成一个 token，而版本 B 切成两字组合。</li>
<li>看排序：版本 B 通常能把「降低幻觉的方法」这篇排到第一，版本 A 可能颗粒无收。</li>
<li>换几个查询试试：<code>Agent 工具调用</code>、<code>蓝牙连不上相机</code>、<code>stateflow</code>（小写英文能直接命中）。</li></ol>
<p><b>结论</b>：中文检索质量的上限，卡在分词这一步。这就是为什么生产级中文 RAG 一定用 jieba 分词或 Embedding 向量——而不是说 TF-IDF 这套思想不行。</p>` },
        { h: '这个实验和真实系统的对应关系', body: `<p>模拟器和 vectorstore.js 的算法完全一致：IDF 由这 6 篇文档实时统计，TF 用词频占比，余弦只算公共词。区别只有语料规模（6 vs 279）。你在这里观察到的现象（分词决定召回、稀缺词决定区分度）在真实库上一比一复现。</p>` },
      ],
      pmNote: '向面试官演示「同一个查询、两种分词、两种结果」，是讲「为什么我计划升级分词/Embedding」最有说服力的方式——用证据说话，而不是背结论。',
      hook: '把「整句中文一个 token」讲成已知边界而不是 bug：MVP 阶段它够用（术语命中），升级路径明确（bigram → jieba → Embedding）。',
    },
    {
      id: 'rag-5', title: '从 TF-IDF 到向量数据库：升级路线图', level: '进阶', minutes: 18,
      keywords: 'embedding 向量数据库 chromadb pgvector 混合检索 GraphRAG 诚实工程',
      summary: 'TF-IDF 只认字面，「优化简历」搜不到「改进 CV」。Embedding 把文字变成捕捉语义的高维向量，「换工作简历建议」和「简历优化」距离很近。向量数据库就是专门存这些向量、做快速近邻搜索的库。',
      sections: [
        { h: 'Embedding 与向量数据库', body: `<ul>
<li><b>Embedding 模型</b>（如 bge-m3、text-embedding-3）把一段文字映射成 768–3072 维稠密向量，语义相近 → 向量夹角小。</li>
<li><b>向量数据库</b>（ChromaDB / pgvector / Milvus）用近似最近邻算法（ANN，如 HNSW）在百万级向量里毫秒级找 Top-K，不用逐个算。</li>
<li><b>代价</b>：多一个服务要部署、Embedding 模型要调 API（或本地跑）、索引要维护。</li></ul>` },
        { h: '生产级检索的终局：混合检索', body: `<p>2026 年的行业默认策略是<b>混合检索</b>：</p>
<ol><li>稀疏检索（BM25/TF-IDF）：抓「精确术语」——专有名词、报错信息它最准</li>
<li>稠密检索（Embedding）：抓「语义改写」——换种说法也能命中</li>
<li>重排（Cross-encoder / RRF 融合）：把两路结果合并精排</li>
<li>再往上，知识之间有「依赖链」（Transformer → 注意力 → 位置编码）时上 <b>GraphRAG</b>：把实体关系建成图谱，支持多跳推理查询</li></ol>` },
      ],
      warn: { title: '诚实工程：简历写的 ChromaDB，实际是什么？', body: '<p>package.json 里确实装了 chromadb 依赖，但<b>全项目从未 import 过它</b>；chroma_db 目录里只有一个 documents.json（原始语料），没有任何向量索引文件。MVP 真正跑的是<b>自实现 TF-IDF 内存检索</b>。面试被追问时，讲成选型决策故事：早期评估过向量库并引入了依赖 → MVP 为控制部署成本与迭代速度改用自实现检索 → 向量库作为升级路径保留。<b>切勿虚构生产环境用了 ChromaDB</b>——面试官深挖必穿帮，诚实 + 决策逻辑反而是加分项。</p>' },
      pmNote: '检索器与生成器模块化分离，让「TF-IDF → Embedding + 向量库」只需替换一个 retriever 文件。技术选型不是一次到位，而是留好演进接口。',
      hook: '面试问「文档量从 300 涨到 100 万怎么演进」：TF-IDF → Embedding + 向量库 → 混合检索 + 重排 → 必要时 GraphRAG，每一步都先过评测集回归。这条演进链要能脱稿讲。',
      refs: [
        { name: 'Chroma（chroma-core/chroma）', url: 'https://github.com/chroma-core/chroma', why: '读 README 就能理解向量数据库的接口长什么样（add/query）' },
        { name: 'pgvector', url: 'https://github.com/pgvector/pgvector', why: '在 PostgreSQL 里做向量检索，小团队最省事的升级路径' },
        { name: 'Milvus', url: 'https://github.com/milvus-io/milvus', why: '大规模向量检索的分布式方案，了解即可' },
      ],
    },
    {
      id: 'rag-6', title: 'LLM 调用与 Prompt 工程', level: '入门', minutes: 15,
      keywords: 'prompt system prompt temperature openai sdk mimo 降级',
      summary: '生成器模块只有 100 行：用 openai SDK 指向 MiMo 的兼容端点，配上两份精心写的 System Prompt（聊天辅导员 / 简历诊断顾问），再加上「LLM 挂了就返回检索原文」的降级策略。',
      sections: [
        { h: '统一接口：OpenAI 兼容协议', body: `<p>国内模型（DeepSeek、MiMo、Kimi…）几乎都兼容 OpenAI SDK——只要改 baseURL 和 apiKey 就能换模型。这是「模型即参数」的第一层体现。</p>
<ul><li><b>temperature 0.85</b>（聊天）：偏活泼发散；<b>0.7</b>（简历优化）：更稳</li>
<li><b>max_tokens 1500 / 3000</b>：控制回答长度 = 控制成本与等待时间</li>
<li><b>历史对话取最近 10 条</b>插入 messages：让多轮对话有记忆，同时克制上下文长度</li></ul>` },
        { h: '两份 System Prompt 的设计', body: `<p><b>聊天场景</b>约束「像朋友聊天、不用星号列表、没把握就直说不知道」——输出风格 = 产品人设。</p>
<p><b>简历诊断</b>约束输出结构：「先优化后简历正文，空两行输出 ---修改建议---，列优化点和原因，不许编造经历」——用格式约定把「正文 + 解释」一次生成，前端按分隔符切开渲染。</p>
<p>RAG 拼接固定句式：<code>user = 「以下是知识库中可能相关的内容，你可以参考：\\n{context}\\n---\\n用户问：{query}」</code>，context 超过 2000 字截断。</p>`, code: [
            { lang: 'js', file: 'backend/rag/generator.js', lines: 'L68–117（节选）', code: `async generateStream(message, context, history, onChunk) {
  const messages = [
    { role: 'system', content: this.chatSystemPrompt },
    ...history.slice(-10),                       // 最近 10 轮记忆
    { role: 'user', content:
      '以下是知识库中可能相关的内容，你可以参考：\\n' +
      context + '\\n\\n---\\n\\n用户问：' + message }
  ];
  const stream = await this.client.chat.completions.create({
    model: 'mimo-v2.5', messages, stream: true, temperature: 0.85, max_tokens: 1500
  });
  for await (const chunk of stream) {            // 逐段取增量文本
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) onChunk(delta);                   // 回调上抛给 SSE 层
  }
}`, explain: '教学点：stream: true 后 SDK 返回异步迭代器，每个 chunk 是一段增量文本；onChunk 回调把「生成」和「传输」解耦——下一模块的 SSE 直接复用它。' },
          ] },
        { h: '降级策略：概率型系统的产品兜底', body: `<p>LLM API 会超时、限流、宕机。server.js 里的兜底：生成失败时，直接把检索到的文档拼成回答返回，并告诉用户「AI 生成暂不可用，以下是相关资料」。对一个学习工具来说，「能查到资料」永远比「生成得好」优先。</p>` },
      ],
      pmNote: 'System Prompt 就是产品逻辑的代码化：语气、格式、禁区都在里面。它是迭代最快、成本最低的「产品改版」——但每次改动都要跑评测集回归。',
      hook: '面试讲 Prompt 工程要落在「约束输出结构」上：简历诊断用分隔符协议让一次生成同时产出正文和建议，这是可验证的工程手段，不是玄学。',
      refs: [
        { name: 'OpenAI API 文档', url: 'https://platform.openai.com/docs/api-reference/chat', why: 'chat.completions 接口与流式参数的权威定义，国内模型全都兼容它' },
        { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', why: '写得最系统的提示词工程教程' },
      ],
    },
    {
      id: 'rag-7', title: 'SSE 流式输出：让首字飞起来', level: '进阶', minutes: 15,
      keywords: 'SSE 流式 TTFT 首字延迟 EventSource fetch ReadableStream',
      summary: '用户对 AI 产品延迟的感知 ≈ 首字时间（TTFT）。同样 5 秒生成完，「转 5 秒圈再出全文」和「1 秒出第一个字然后打字机式推进」是两个产品。SSE（Server-Sent Events）是实现打字机效果的标准方案。',
      sections: [
        { h: 'SSE 是什么', body: `<p>HTTP 响应不关闭，持续推送 <code>data: ...</code> 格式的文本行。三个响应头 + 任意多次 res.write：</p>`, code: [
            { lang: 'js', file: 'backend/server.js', lines: 'L242–278（节选）', code: `res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

const documents = await retriever.retrieve(message, 5);   // 先检索
const context = retriever.buildContext(documents, 2000);

// 自定义事件协议：先推来源，再逐段推正文，最后推 done
res.write('data: ' + JSON.stringify({ type: 'sources', sources: documents }) + '\\n\\n');
await generator.generateStream(message, context, history, (chunk) => {
  res.write('data: ' + JSON.stringify({ type: 'chunk', content: chunk }) + '\\n\\n');
});
res.write('data: ' + JSON.stringify({ type: 'done' }) + '\\n\\n');
res.end();`, explain: '教学点：事件协议自定义成 { type, ... }——sources 先到，前端能先渲染「引用了哪 5 篇」，正文再逐字出现，感知延迟进一步降低。' },
          ] },
        { h: '前端为什么不用 EventSource？', body: `<p>浏览器原生 EventSource 只支持 GET、不能带自定义 Header。而聊天要 <b>POST + JWT 鉴权头</b>，所以用 fetch + ReadableStream 手动解析：</p>`, code: [
            { lang: 'ts', file: 'src/lib/chatApi.ts', lines: 'L82–118（节选）', code: `const reader = response.body?.getReader();
const decoder = new TextDecoder();
let buffer = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\\n');
  buffer = lines.pop() || '';        // 关键：半行留到下一轮（TCP 分包）
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.type === 'sources') onSources?.(data.sources);
      if (data.type === 'chunk')  onChunk?.(data.content);
    }
  }
}`, explain: '教学金句：buffer = lines.pop() || \'\'。网络包不保证按行切齐，最后半行必须留着拼到下一个包，否则 JSON.parse 直接炸。这是所有流解析的第一坑。' },
          ] },
      ],
      warn: { title: '实现与宣传的差异（面试如实讲）', body: '<p>流式函数写好了，但聊天页 ChatPage 实际调用的是<b>非流式</b> sendMessage；简历优化页 ResumePage 用的是流式。面试讲法：SSE 链路已验证（简历页全流程流式），聊天页当时优先做了功能闭环、流式接入在计划内。如实讲 + 有证据，比说「全程流式」更可信。</p>' },
      pmNote: '把 TTFT 写进验收标准（本项目目标：首字进入可接受区间）。延迟是概率型产品的硬约束——「多模型分级 + 流式 + 缓存」是三板斧。',
      hook: '面试被问「TTFT 怎么优化」：流式输出（体感）→ 检索与生成链路并行化 → 高频问题缓存 → 简单查询走小模型。四层，由体验到成本。',
      refs: [
        { name: 'MDN: Server-Sent Events', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events', why: 'SSE 协议与 EventSource 的权威文档' },
        { name: 'MDN: ReadableStream', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream', why: 'fetch 流式读取的底层 API' },
      ],
    },
    {
      id: 'rag-8', title: '认证、安全与部署上线', level: '进阶', minutes: 15,
      keywords: 'JWT OAuth bcrypt state CSRF 原子写 Cloudflare Pages Railway Glitch',
      summary: '独立产品的最后一公里：邮箱 + GitHub OAuth 双登录（JWT 鉴权）、用户数据文件的安全落盘、以及三次部署迁移的完整故事（Vercel+Railway → Cloudflare Pages+Railway → Glitch）。',
      sections: [
        { h: 'JWT：自己签发的通行证', body: `<ul>
<li>登录成功 → <code>jwt.sign(payload, secret, { expiresIn: '7d' })</code> 签发 Token</li>
<li>之后每个请求带 <code>Authorization: Bearer &lt;token&gt;</code>，中间件验签后把用户信息挂上 req</li>
<li>好处：服务端不用存 session，天然适配无状态部署；<code>requireAdmin</code> 再看一眼 role 字段就是管理后台门禁</li></ul>` },
        { h: 'GitHub OAuth：手写而不依赖 passport', body: `<ol>
<li>前端跳 GitHub 授权页前，后端生成 <code>crypto.randomBytes(32)</code> 的 <b>state</b> 存进 httpOnly Cookie（10 分钟有效）</li>
<li>GitHub 回调带回 code + state → 后端先校验 state 和 Cookie 里的一致（防 CSRF：攻击者伪造不了你的随机数）</li>
<li>code 换 access_token → 拉 /user 拿资料，email 为空再拉 /user/emails 找主邮箱</li>
<li>签发 JWT，encodeURIComponent 后拼进重定向 URL 交给前端 /auth/callback</li></ol>` },
        { h: '数据落盘：原子写入', body: `<p>用户存在 users.json（这个量级不需要数据库）。关键细节：先写 <code>users.json.tmp</code>，再 rename 覆盖——写入中途断电/崩溃也不会留下半个损坏的 JSON；加载时发现损坏自动备份为 .corrupted 并重建。文件型存储的工程素养就在这种细节里。</p>` },
        { h: '部署三次迁移的故事', body: `<ol>
<li><b>Vercel + Railway</b>：标准海外组合，vercel.json 配 SPA rewrites 兜底路由</li>
<li><b>Cloudflare Pages + Railway</b>：国内免备案、CDN 更快——线上 ai-interview-6rn.pages.dev 就是这套</li>
<li><b>Glitch</b>：免费 + 文件持久化（users.json 重启不丢）+ SSE 可用；代价是限流与休眠</li></ol>
<p>前端还有个降级设计：后端挂了时，题库自动回退加载 Pages 同源的静态 questions.json——纯静态模式下练习模式依然可用。</p>` },
      ],
      pmNote: '部署选型的决策变量是：成本（免费额度）、国内可达性（备案/CDN）、能力约束（SSE 能不能跑、文件存不存得下）。每一次迁移都是一次「约束变了 → 方案跟着变」的产品决策。',
      hook: '面试问「你上线遇到过什么问题」，用 Glitch 迁移答：Railway 免费额度收紧 → 评估了 Cloudflare Workers（发现带 fs 的长驻 Express 跑不了）→ 选 Glitch（文件持久化 + SSE）——展示真实的取舍过程。',
      refs: [
        { name: 'Express', url: 'https://github.com/expressjs/express', why: '后端框架本体，读官方 guide 理解中间件模型' },
        { name: 'Zustand', url: 'https://github.com/pmndrs/zustand', why: '前端全局状态库，几行代码管理登录态' },
        { name: 'Cloudflare Pages', url: 'https://developers.cloudflare.com/pages/', why: '前端静态托管 + 免费额度，本产品线上环境' },
      ],
    },
  ],
  quiz: [
    { q: 'RAG 流水线的正确顺序是？', opts: ['生成 → 检索 → 分块', '分块 → 检索 → 拼接上下文 → 生成', '检索 → 分块 → 生成', '拼接 → 生成 → 检索'], a: 1, why: '离线先分块入库；在线先检索 Top-K，把结果拼接进上下文，最后才交给 LLM 生成。' },
    { q: '本项目 chunkContent 的分块策略是？', opts: ['每 500 字硬切', '按空行分段落后贪心拼接，单块上限 1500 字', '按句子随机切分', '用 Embedding 做语义切分'], a: 1, why: 'crawl.js L176：按段落（\\n\\n 分割）逐段装箱，超过 1500 字就封箱，保证块的语义完整性。' },
    { q: 'IDF 的直觉含义是什么？', opts: ['词在这篇文档里出现得越多越重要', '词在整个语料库里越稀缺，区分度越高', '文档越长权重越高', '查询越长得分越高'], a: 1, why: 'IDF = log(N/(1+df))：「面试」出现在 80% 的文档里区分度低；「LoRA」只出现在 2% 里，一旦命中就是强信号。' },
    { q: '余弦相似度衡量的是？', opts: ['两个向量的长度差', '两个向量的夹角，与长度无关', '两个文档的字数差', '两个词的编辑距离'], a: 1, why: '点积除以两个模长，只看方向（词的分布结构）不看长短，所以长文档和短问题也能公平比较。' },
    { q: '前端为什么用 fetch + ReadableStream 而不是 EventSource 接收流式回答？', opts: ['EventSource 兼容性差', 'EventSource 只支持 GET、不能带 JWT 请求头，而聊天接口需要 POST + 鉴权', 'fetch 更快', 'EventSource 不支持 JSON'], a: 1, why: '原生 EventSource 只能 GET、不能自定义 Header；带 JWT 的 POST 流式请求只能用 fetch 手动读流。' },
    { q: 'SSE 自定义事件协议的推送顺序是？', opts: ['done → chunk → sources', 'chunk → done → sources', 'sources → chunk×N → done', '随机顺序'], a: 2, why: '先推来源（前端先渲染「引用了哪 5 篇」），再逐段推正文，最后 done 关流。体验设计进协议。' },
    { q: '评估一个 RAG 系统最该看的指标组合是？', opts: ['只有回答速度', '召回率 Recall@K + 引用准确率 + 幻觉率 + TTFT', '只有用户数', '模型参数量'], a: 1, why: '检索层看召回，生成层看引用准确率和幻觉率，体验层看 TTFT——四层指标对应流水线的四个环节。' },
    { q: '（诚实题）本项目 MVP 实际使用的检索方案是？', opts: ['ChromaDB 向量库', '自实现 TF-IDF + 余弦相似度内存检索', 'Elasticsearch', 'MySQL 全文索引'], a: 1, why: 'chromadb 在依赖里但从未 import；实际是 vectorstore.js 自实现的 TF-IDF 内存检索。面试要讲成选型故事，不要虚构。' },
    { q: '本项目中文分词的真实实现是？', opts: ['jieba 精确模式', '正则切分：连续中文整句成为一个 token', 'Embedding 自动分词', '按字单字切分'], a: 1, why: 'tokenize 用正则保留英文单词和连续中文串——连续无标点中文会变成超长 token，这是检索质量的天然上限（互动实验可验证）。' },
  ],
};
