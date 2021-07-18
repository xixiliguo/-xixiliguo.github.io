(self.webpackChunkvuepress_blog=self.webpackChunkvuepress_blog||[]).push([[650],{6130:(n,e,a)=>{"use strict";a.r(e),a.d(e,{data:()=>t});const t={key:"v-21cc0a0e",path:"/algorithm/radix-tree.html",title:"Radix Tree介绍与httprouter源码笔记",lang:"en-US",frontmatter:{title:"Radix Tree介绍与httprouter源码笔记",author:"Peter Wang",tags:["radix-tree","httprouter"],date:"2019-03-23T09:52:44.000Z",draft:!1},excerpt:"",headers:[],filePathRelative:"algorithm/radix-tree.md",git:{updatedTime:1626591395e3,contributors:[]}}},633:(n,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>s});const t=(0,a(6252).uE)('<p>Trie又叫前缀树, 广泛应用于字符串搜索. 它是多叉树结构, 每个节点代表一个字符, 从根出发到叶子, 所访问过的字符连接起来就是一个字符串.<br> Radix tree 是Trie的一种优化方式, 对空间进一步压缩.</p><h1 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h1><p>Trie又叫前缀树, 广泛应用于字符串搜索. 它是多叉树结构, 每个节点代表一个字符, 从根出发到叶子, 所访问过的字符连接起来就是一个字符串.<br> Radix tree 是Trie的一种优化方式, 对空间进一步压缩.</p><p>Trie可用如下类型表示</p><div class="language-go ext-go"><pre class="language-go"><code><span class="token keyword">type</span> Trie <span class="token keyword">struct</span> <span class="token punctuation">{</span>\n    isLeaf <span class="token builtin">bool</span>      <span class="token comment">//用于表示该节点是不是一个字符串的结尾</span>\n    child <span class="token punctuation">[</span><span class="token punctuation">]</span>Trie\n    value <span class="token builtin">byte</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>下图左侧是字符串 sex,seed,sleep,son 四个字段串的Trie数据结构表示. 可用看到sleep这个字符串需要5个节点表示. 其实e后面只跟一个p, 也就是只有一个子节点, 是完全可以和父节点压缩合并的. 右侧是优化后的数据结构, 节省了空间,同时也提高了查询效率(左边字符串<code>sleep</code>查询需要5步, 右边只需要3步), 这就是radix tree. <img src="/img/radix-tree.jpg" alt="radix-tree"></p><h1 id="httproute的实现" tabindex="-1"><a class="header-anchor" href="#httproute的实现" aria-hidden="true">#</a> httproute的实现</h1><p>golang语言实现的httproute是个高性能的http路由分发器. 它负责将很多个路径注册到不同到处理函数. 当收到请求后, 快速查找是否请求的http路径有对应的处理器,并进行下一步的业务逻辑处理. 主要使用radix tree实现了高效的路径查找.<br> 同时路径还支持两种通配符匹配, 具体用法见readme</p><p>如下是节点的数据结构, <code>indices</code>字符和<code>children</code>里的节点排列顺序一一对应. handle非nil则说明是一个字符串的终点.</p><div class="language-go ext-go"><pre class="language-go"><code><span class="token keyword">type</span> node <span class="token keyword">struct</span> <span class="token punctuation">{</span>\n\tpath      <span class="token builtin">string</span>      <span class="token comment">// 该节点对应的path</span>\n\twildChild <span class="token builtin">bool</span>        <span class="token comment">// 是否通配</span>\n\tnType     nodeType    <span class="token comment">// 表示节点类型</span>\n\tmaxParams <span class="token builtin">uint8</span>\n\tindices   <span class="token builtin">string</span>      <span class="token comment">// 子节点path的第一个byte的集合</span>\n\tchildren  <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>node    <span class="token comment">//  子节点</span>\n\thandle    Handle\n\tpriority  <span class="token builtin">uint32</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">const</span> <span class="token punctuation">(</span>\n\tstatic nodeType <span class="token operator">=</span> <span class="token boolean">iota</span> <span class="token comment">// 普通节点</span>\n\troot                   <span class="token comment">// 根节点</span>\n    param                  <span class="token comment">// 命令参数对应的节点  :name </span>\n\tcatchAll               <span class="token comment">// 匹配后面所有字符的节点    *all </span>\n<span class="token punctuation">)</span>\n</code></pre></div><p>此处先不考虑通配符这块的逻辑,假设待匹配的为curpath,待比较的node先设置为根节点.<br> 插入新字符串的逻辑如下:</p><ol><li>公共前缀长度小于node.path: 则需要将node split为两个node. parent node的path为公共前缀, child node的path为原node.path剔除公共b. 前缀部分后的path,继续步骤2</li><li>公共前缀长度小于curpath, 则进入步骤3, 否则步骤4</li><li>设置curpath为 curpath剔除公共前缀后的部分. 遍历node.indices的每一个byte, 与curpath的第一个byte比较.<br> 有相等的,则设置node为匹配的child node, 跳回步骤1继续循环.<br> 没有相等的, 则新建叶子节点, 退出</li><li>公共前缀长度等于node.path: 设置为叶子节点, 退出</li></ol><p>如下左边是/sex,/sleep,/son的内部呈现, 右边是插入/seed 后内部的呈现<br><img src="/img/insert-tree-node.jpg" alt="radix-tree"></p><p>代码实现主要是在<code>func (n *node) addRoute(path string, handle Handle)</code> 和 <code>func (n *node) insertChild(numParams uint8, path, fullPath string, handle Handle)</code>. 因为httproute加了很多对通配符路径的特殊处理, 可以先看<code>go-radix</code>了解下通用radix-tree的实现.</p><h1 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考:</h1><p>https://en.wikipedia.org/wiki/Radix_tree<br> https://github.com/julienschmidt/httprouter<br> https://github.com/armon/go-radix</p>',16),s={render:function(n,e){return t}}}}]);