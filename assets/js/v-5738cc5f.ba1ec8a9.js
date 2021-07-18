(self.webpackChunkvuepress_blog=self.webpackChunkvuepress_blog||[]).push([[851],{2710:(e,n,o)=>{"use strict";o.r(n),o.d(n,{data:()=>c});const c={key:"v-5738cc5f",path:"/k8s/runc.html",title:"runc 容器运行时学习笔记",lang:"en-US",frontmatter:{title:"runc 容器运行时学习笔记",author:"Peter Wang",tags:["docker","runc"],date:"2019-11-03T02:31:44.000Z",draft:!1},excerpt:"",headers:[],filePathRelative:"k8s/runc.md",git:{updatedTime:1626591395e3,contributors:[]}}},8511:(e,n,o)=>{"use strict";o.r(n),o.d(n,{default:()=>t});const c=(0,o(6252).uE)('<p>runc实现了CRI接口, 也就是容器运行时. 利用linux的cgroup, namespace使进程运行在一个虚拟的隔离环境, 本文记录了源码阅读后的心得.</p><h1 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h1><p>一. <code>runc --systemd-cgroup --debug run 123 --bundle /mycontainer/</code>就可以启动一个容器.</p><p>--bundle 指定启动容器所需的config.json和 rootfs的位置, 类似下面的结构.<br> rootfs是一个文件夹, 里面是容器进程运行所有的所有依赖文件. 一个小型的os的rootfs</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token comment"># ls -rlt</span>\ntotal <span class="token number">8</span>\ndrwxr-xr-x <span class="token number">12</span> root root <span class="token number">4096</span> Sep  <span class="token number">4</span> <span class="token number">20</span>:31 rootfs\n-rw-r--r--  <span class="token number">1</span> root root <span class="token number">2685</span> Sep  <span class="token number">7</span> <span class="token number">22</span>:38 config.json\n</code></pre></div><p>config.json规范可参见 https://github.com/opencontainers/runtime-spec</p><p>二. <code>runc run</code>相当于先<code>create</code>, 后再执行<code>start</code>. 但<code>create</code>创建的容器是只能在后台运行.<br> 三. 创建容器后,会创建相应的临时信息到<code>/run/runc/[container id]</code>. 已表示容器已创建, 并生成一个<code>exec.fifo</code>管道文件. 外部命令也能从该文件夹下的state.json文件获取容器的一些基本信息</p><h1 id="源码分析" tabindex="-1"><a class="header-anchor" href="#源码分析" aria-hidden="true">#</a> 源码分析</h1><p>一. <code>runc run xxx</code>大致过程如下:</p><div class="language-text ext-text"><pre class="language-text"><code>                                                                                                               \n                                                                                                               \n+-----------------------------------------------+             +-----------------------------------------------+\n|                                               |             |                                               |\n| startContainer(context, spec, CT_ACT_RUN, nil)| ---------&gt;  |   createContainer(context, id, spec)          |\n|                                               |             |                                               |\n+-----------------------------------------------+             +-----------------------------------------------+\n                                                                                      |                        \n                                                                                      |                        \n                                                                                      |                        \n                                                                                      |                        \n                                                                                      |                        \n                                                                                      |                        \n                                                                                      v                        \n                                                                                                               \n                                                              +-----------------------------------------------+\n                                                              |                                               |\n                                                              |            &amp;runner.Run(config)                |\n                                                              |                                               |\n                                                              +-----------------------------------------------+\n                                                                                                               \n                                                                                                                \n</code></pre></div><p><code>run</code>的入口在<code>run.go</code>, <code>setupSpec</code>先校验config.json并转换为go下面的结构里, 在<code>startContainer</code>里创建容器用启动<br><code>startContainer-&gt;createContainer</code>通过工厂函数创建一个容器对应的数据结构体, 然后通过 runner启动它</p><p>二. factory.go 和 factory_linux.go 是具体的工厂接口和 linux下的实现. 主要是生产出一个容器对象. 做了很多校验工作, 比如用户指定的容器id是否符合规范, config.json里的值是否合法, 是否规范</p><p>三. 默认cgroup下指定了cgroup, 比如 abc, 则为 /abc<br> 如果没有指定cgroupsPath, 路径为 容器id<br> 使用systemd-cgroup, 如果在config.json里指定了cgroup子系统path , 格式必须为 <code>slice:prefix:name</code>, 否则会报错.<br> 例如&quot;cgroupsPath&quot;: &quot;system.slice:testrunc:123&quot;<br> 没有指定cgrouppatch, 则默认的格式为 system.slice:runc:容器id</p><p>四. 创建容器的过程是runc准备好相关信息后, 创建一个子进程, 命令为<code>runc init</code>, 具体的逻辑在<code>init.go</code>里. 但在golang代码运行前, <code>package nsenter</code>里的cgo代码会先运行起来. 因为<code>init.go</code>里导入了它. 它比所有的go 代码提前运行, 可以保证在没有go进入多线程的情况下执行切换命名空间的作用.</p><p><code>init.go</code>里有 <code>_ &quot;github.com/opencontainers/runc/libcontainer/nsenter&quot;</code> 这句</p><p><code>nsenter.go</code>里的 init语句可使包被引用时自动执行 nsexec().</p><div class="language-golang ext-golang"><pre class="language-golang"><code>// +build linux,!gccgo\n\npackage nsenter\n\n/*\n#cgo CFLAGS: -Wall\nextern void nsexec();\nvoid __attribute__((constructor)) init(void) {\n\tnsexec();\n}\n*/\nimport &quot;C&quot;\n</code></pre></div><p>具体创建的过程如下图所示:<br><img src="/img/runc.png" alt="runc运行容器的流程图"></p><p>无论创建还是容器, 都先将容器start, 执行``(c *linuxContainer) Start()<code>, 创建子进程后将状态信息写入</code>/run/runc/[container id]/state.json<code></code>runc create<code>只是创建容器, 它并不会运行 </code>(c *linuxContainer) exec()<code>. 所以容器进程一直阻塞在 </code>write to exec.fifo<code>, 无法执行execve, 也就无法真正运行容器的init进程. </code>run start<code>入口在</code>start.go<code>, 就是执行</code>container.Exec()<code>, 读exec.fifo的信息, 返回的字节数大于0, 那就是收到了</code>0x00`, 则容器进程开始execve,正式运行起来. 如果返回的字节数&lt;=0, 则说明容器已经处于运行状态.</p><div class="language-golang ext-golang"><pre class="language-golang"><code>\t\tswitch status {\n\t\tcase libcontainer.Created:\n\t\t\treturn container.Exec()\n\t\tcase libcontainer.Stopped:\n\t\t\treturn errors.New(&quot;cannot start a container that has stopped&quot;)\n\t\tcase libcontainer.Running:\n\t\t\treturn errors.New(&quot;cannot start an already running container&quot;)\n\t\tdefault:\n\t\t\treturn fmt.Errorf(&quot;cannot start a container in the %s state\\n&quot;, status)\n        }\n</code></pre></div><p>四. 容器进程默认的0,1,2 标准IO设置与config.json的配置相关</p><p>假如config.json中<code>Terminal: True</code>:<br> 命令行没有 -d, runc自建socket对, 将其中一个作为容器的consolesocket传入子进程<br> 命令行指定 -d --console-socket xxx, 直接将指定的consolescoetk传入子进程<br> 容器进程<code>open /dev/ptmx</code>, slaveId给0,1,2, masterID通过consolesocket发出, 非detach模式下runc接受到masterID, 然后0收到后写入masterID, masterID收到的写入1,2<br> detach模式下需要额外的进程在运行&quot;runc start&quot;前在指定的socekt监听, 这样才能和容器通信, 参考<code>recvtty.go</code>的实现</p><p>假如config.json中<code>Terminal: False</code>:<br> 命令行没有 -d, runc创建三个pipe, 自己从标准输入读到的信息, 会写入到管道一段, 这样容器进程的标准输入就能从管道读到, 其他类推<br> 命令行指定 -d 直接将runc的三个IO直接让容器ID继承</p><p><code>utils_linux.go</code>里的<code>setupIO</code>具体实现了runc对consoleSocket或者其他父进程里的IO设置<br><code>(l *linuxStandardInit) Init() </code>里的<code>setupConsole</code> 配置终端</p><p>五. <code>runc exec</code>是在已有的容器里执行一个命令<br> 和运行容器时启动的默认命令时区别在于传入<code>runner</code>的字段<code>init</code>. exec时该字段为<code>false</code><br> 导致生成<code>newSetnsProcess</code>, 而不是 <code>newInitProcess</code><br> 在容器的进程里是<code>func (l *linuxSetnsInit) Init()</code>, 而不是<code>func (l *linuxStandardInit) Init()</code><br> linuxSetnsInit的init的过程步骤很少, 因为在创建容器是许多工作已经做完了. 只是简单的配置下IO,然后直接<code>execve</code>到其要指定的命令</p><p>六. <code>runc ps [container id]</code>查询该容器下所有进程<br> 通过<code>/var/run/[container id]/state.json</code>获取容器信息,然后通过其cgroup的路径找到所有的进程<br> 再从<code>ps -ef</code>里获取这些进程的信息</p><p>七. <code>runc pause xxx</code>和<code>runc resume</code>用于冻结和恢复容器进程的执行. 是使用cgroup提供的freezer能力实现的</p>',27),t={render:function(e,n){return c}}}}]);