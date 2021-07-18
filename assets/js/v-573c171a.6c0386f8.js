(self.webpackChunkvuepress_blog=self.webpackChunkvuepress_blog||[]).push([[595],{9979:(n,s,a)=>{"use strict";a.r(s),a.d(s,{data:()=>t});const t={key:"v-573c171a",path:"/linux/linux-boot.html",title:"Linux Boot过程总结",lang:"en-US",frontmatter:{title:"Linux Boot过程总结",author:"Peter Wang",tags:["linux","boot","systemd"],date:"2020-04-19T07:17:50.000Z",draft:!1},excerpt:"",headers:[{level:2,title:"bios启动",slug:"bios启动",children:[]},{level:2,title:"grub启动",slug:"grub启动",children:[]},{level:2,title:"initramfs启动",slug:"initramfs启动",children:[]},{level:2,title:"切换到真实的根目录",slug:"切换到真实的根目录",children:[]},{level:2,title:"与kdump相关的initramfs知识",slug:"与kdump相关的initramfs知识",children:[]},{level:2,title:"参考",slug:"参考",children:[]}],filePathRelative:"linux/linux-boot.md",git:{updatedTime:1626591395e3,contributors:[]}}},753:(n,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>p});const t=(0,a(6252).uE)('<p>记录linux启动过程的总结</p><h2 id="bios启动" tabindex="-1"><a class="header-anchor" href="#bios启动" aria-hidden="true">#</a> bios启动</h2><p>磁盘的前512字节内容也叫也叫Master boot record, 简称MBR 主板里的bios会扫描设备/磁盘MBR的最后两个字节是不是<code>aa55</code>,如果是则认为是可启动设备. 会按照配置的启动顺序挨个尝试启动.</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># xxd -l 512 /dev/sda</span>\n0000000: eb63 <span class="token number">9010</span> 8ed0 bc00 b0b8 0000 8ed8 8ec0  .c<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000010: fbbe 007c bf00 06b9 0002 f3a4 ea21 0600  <span class="token punctuation">..</span>.<span class="token operator">|</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">!</span><span class="token punctuation">..</span>\n0000020: 00be be07 <span class="token number">3804</span> 750b 83c6 <span class="token number">1081</span> fefe 0775  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token number">8</span>.u<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>u\n0000030: f3eb 16b4 02b0 01bb 007c b280 8a74 018b  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">|</span><span class="token punctuation">..</span>.t<span class="token punctuation">..</span>\n0000040: 4c02 cd13 ea00 7c00 00eb fe00 0000 0000  L<span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">|</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.\n0000050: 0000 0000 0000 0000 0000 0080 0100 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000060: 0000 0000 fffa <span class="token number">9090</span> f6c2 <span class="token number">8074</span> 05f6 c270  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.t<span class="token punctuation">..</span>.p\n0000070: <span class="token number">7402</span> b280 ea79 7c00 0031 c08e d88e d0bc  t<span class="token punctuation">..</span><span class="token punctuation">..</span>y<span class="token operator">|</span><span class="token punctuation">..</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000080: 0020 fba0 647c 3cff <span class="token number">7402</span> 88c2 52be 057c  <span class="token builtin class-name">.</span> <span class="token punctuation">..</span>d<span class="token operator">|</span><span class="token operator">&lt;</span>.t<span class="token punctuation">..</span>.R<span class="token punctuation">..</span><span class="token operator">|</span>\n0000090: b441 bbaa 55cd 135a <span class="token number">5272</span> 3d81 fb55 aa75  .A<span class="token punctuation">..</span>U<span class="token punctuation">..</span>ZRr<span class="token operator">=</span><span class="token punctuation">..</span>U.u\n00000a0: <span class="token number">3783</span> e101 <span class="token number">7432</span> 31c0 <span class="token number">8944</span> 0440 <span class="token number">8844</span> ff89  <span class="token number">7</span><span class="token punctuation">..</span>.t21<span class="token punctuation">..</span>D.@.D<span class="token punctuation">..</span>\n00000b0: <span class="token number">4402</span> c704 <span class="token number">1000</span> 668b 1e5c 7c66 895c 0866  D<span class="token punctuation">..</span><span class="token punctuation">..</span>.f<span class="token punctuation">..</span><span class="token punctuation">\\</span><span class="token operator">|</span>f.<span class="token punctuation">\\</span>.f\n00000c0: 8b1e 607c <span class="token number">6689</span> 5c0c c744 0600 70b4 42cd  <span class="token punctuation">..</span><span class="token variable"><span class="token variable">`</span><span class="token operator">|</span>f.<span class="token punctuation">\\</span><span class="token punctuation">..</span>D<span class="token punctuation">..</span>p.B.\n00000d0: <span class="token number">1372</span> 05bb 0070 eb76 b408 cd13 730d 5a84  .r<span class="token punctuation">..</span>.p.v<span class="token punctuation">..</span><span class="token punctuation">..</span>s.Z.\n00000e0: d20f 83de 00be 857d e982 0066 0fb6 c688  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token punctuation">}</span><span class="token punctuation">..</span>.f<span class="token punctuation">..</span><span class="token punctuation">..</span>\n00000f0: 64ff <span class="token number">4066</span> <span class="token number">8944</span> 040f b6d1 c1e2 0288 e888  d.@f.D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000100: f440 <span class="token number">8944</span> 080f b6c2 c0e8 0266 <span class="token number">8904</span> 66a1  .@.D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.f<span class="token punctuation">..</span>f.\n0000110: 607c <span class="token number">6609</span> c075 4e66 a15c 7c66 31d2 66f7  <span class="token variable">`</span></span><span class="token operator">|</span>f<span class="token punctuation">..</span>uNf.<span class="token punctuation">\\</span><span class="token operator">|</span>f1.f.\n0000120: <span class="token number">3488</span> d131 d266 f774 043b <span class="token number">4408</span> 7d37 fec1  <span class="token number">4</span><span class="token punctuation">..</span><span class="token number">1</span>.f.t.<span class="token punctuation">;</span>D.<span class="token punctuation">}</span><span class="token number">7</span><span class="token punctuation">..</span>\n0000130: 88c5 30c0 c1e8 0208 c188 d05a 88c6 bb00  <span class="token punctuation">..</span><span class="token number">0</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>Z<span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000140: 708e c331 dbb8 0102 cd13 721e 8cc3 601e  p<span class="token punctuation">..</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>r<span class="token punctuation">..</span>.`.\n0000150: b900 018e db31 f6bf 0080 8ec6 fcf3 a51f  <span class="token punctuation">..</span><span class="token punctuation">..</span>.1<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n0000160: 61ff 265a 7cbe 807d eb03 be8f 7de8 <span class="token number">3400</span>  a.<span class="token operator">&amp;</span>Z<span class="token operator">|</span><span class="token punctuation">..</span><span class="token punctuation">}</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">}</span>.4.\n0000170: be94 7de8 2e00 cd18 ebfe <span class="token number">4752</span> <span class="token number">5542</span> <span class="token number">2000</span>  <span class="token punctuation">..</span><span class="token punctuation">}</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.GRUB <span class="token builtin class-name">.</span>\n0000180: <span class="token number">4765</span> 6f6d 0048 <span class="token number">6172</span> <span class="token number">6420</span> <span class="token number">4469</span> 736b 0052  Geom.Hard Disk.R\n0000190: <span class="token number">6561</span> <span class="token number">6400</span> <span class="token number">2045</span> <span class="token number">7272</span> 6f72 0d0a 00bb 0100  ead. Error<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001a0: b40e cd10 ac3c 0075 f4c3 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">&lt;</span>.u<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001b0: 0000 0000 0000 0000 ab83 0a00 0000 <span class="token number">8020</span>  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.\n00001c0: <span class="token number">2100</span> 83fe ffff 0008 0000 dfc7 <span class="token number">8102</span> 0000  <span class="token operator">!</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.\n00001d0: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001e0: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001f0: 0000 0000 0000 0000 0000 0000 0000 55aa  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>U.\n</code></pre></div><p>MBR里还有分区表信息, 从偏移量<code>446</code>开始, 最多放4个主分区, 下面显示只有一个主分区</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># xxd -s 446 -l 64 /dev/sda</span>\n00001be: <span class="token number">8020</span> <span class="token number">2100</span> 83fe ffff 0008 0000 dfc7 <span class="token number">8102</span>  <span class="token builtin class-name">.</span> <span class="token operator">!</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.\n00001ce: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001de: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n00001ee: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>\n</code></pre></div><p>如果分区损坏, 可使用testdisk尝试修复, 有linux和window两个版本. 主页: www.cgsecurity.org</p><p>在qemu+libvirt下, bios启动会打印<code>Booting from Hard Disk...</code>信息.代码如下:</p><div class="language-c ext-c"><pre class="language-c"><code>    <span class="token keyword">switch</span> <span class="token punctuation">(</span>ie<span class="token operator">-&gt;</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> IPL_TYPE_FLOPPY<span class="token operator">:</span>\n        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Booting from Floppy...\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">boot_disk</span><span class="token punctuation">(</span><span class="token number">0x00</span><span class="token punctuation">,</span> CheckFloppySig<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">break</span><span class="token punctuation">;</span>\n    <span class="token keyword">case</span> IPL_TYPE_HARDDISK<span class="token operator">:</span>\n        <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Booting from Hard Disk...\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token function">boot_disk</span><span class="token punctuation">(</span><span class="token number">0x80</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>如果检查发现<code>mbr</code>的512字节处不是<code>55aa</code>, 则无法启动虚拟机, 界面显示<code>Boot failed: not a bootable disk</code>, 对应代码如下</p><div class="language-c ext-c"><pre class="language-c"><code>        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">GET_FARVAR</span><span class="token punctuation">(</span>bootseg<span class="token punctuation">,</span> mbr<span class="token operator">-&gt;</span>signature<span class="token punctuation">)</span> <span class="token operator">!=</span> MBR_SIGNATURE<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Boot failed: not a bootable disk\\n\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">return</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n</code></pre></div><p>所以VNC遇到如上两个信息, 需要检查底层问题.</p><p>以上代码来自https://www.seabios.org/downloads/, 是qemu默认的bios启动程序</p><h2 id="grub启动" tabindex="-1"><a class="header-anchor" href="#grub启动" aria-hidden="true">#</a> grub启动</h2><p>bios读取MBR后,然后执行里面的代码, 这样将控制权交到grub2. 这块代码也叫<code>bootloader</code>.<br> 通常运行<code>grub2-install /dev/sda</code>将<code>bootloader</code>写入MBR. 当然还会在512字节后面继续写入一些文件 可以加参数<code>--debug</code>看到更详细的信息</p><p>如果发现grub损坏, 可以尝试挂盘并chroot到根目录, 执行<code>grub2-install /dev/xxxx</code>. /dev/xxx为具体的盘符名<br> 如果能看到grub的shell命令行, 说明可能grub.cfg配置有误, 导致无法选择具体的引导项. 可以手工指定具体的引导信息, 尝试启动<br> 以下是参考样例, 可以找一台完全一样的主机配置会修复故障机<br><code>ls</code>命令可以查看当前设备及里面的文件, 用于确定文件是否真的存在. 也能判断分区信息<br><code>tab</code>可用于命令联想</p><div class="language-bash ext-sh"><pre class="language-bash"><code>        <span class="token builtin class-name">set</span> <span class="token assign-left variable">root</span><span class="token operator">=</span><span class="token string">&#39;hd0,msdos1&#39;</span>\n        linux16 /boot/vmlinuz-3.10.0-1062.el7.x86_64 <span class="token assign-left variable">root</span><span class="token operator">=</span>UUID<span class="token operator">=</span>5de1c8df-9b03-4830-9b56-b96a2290b78f ro vconsole.keymap<span class="token operator">=</span>us <span class="token assign-left variable">crashkernel</span><span class="token operator">=</span>auto\n        initrd16 /boot/initramfs-3.10.0-1062.el7.x86_64.img\n</code></pre></div><p>有时挂盘修复时choot后好多特殊的文件系统找不到, 可以提前手工挂载下, 然后chroot<br> 如下命令仅供参考, 假设要修复的系统盘已经挂在<code>mnt</code></p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token comment"># mount --bind /dev /mnt/dev</span>\n<span class="token comment"># mount -t proc proc /mnt/proc</span>\n<span class="token comment"># mount -t sysfs none /mnt/sys</span>\n<span class="token comment"># chroot /mnt /bin/bash</span>\n</code></pre></div><p>有时我们需要检查磁盘或者分区当前的文件系统, 下面列出三种方法:</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lsblk -f</span>\nNAME   FSTYPE LABEL UUID                                 MOUNTPOINT\nsda\n└─sda1 ext4         5de1c8df-9b03-4830-9b56-b96a2290b78f /\nsr0\n<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># blkid</span>\n/dev/sda1: <span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token string">&quot;5de1c8df-9b03-4830-9b56-b96a2290b78f&quot;</span> <span class="token assign-left variable">TYPE</span><span class="token operator">=</span><span class="token string">&quot;ext4&quot;</span>\n<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># file -s /dev/sda1</span>\n/dev/sda1: Linux <span class="token function">rev</span> <span class="token number">1.0</span> ext4 filesystem data, <span class="token assign-left variable">UUID</span><span class="token operator">=</span>5de1c8df-9b03-4830-9b56-b96a2290b78f <span class="token punctuation">(</span>needs journal recovery<span class="token punctuation">)</span> <span class="token punctuation">(</span>extents<span class="token punctuation">)</span> <span class="token punctuation">(</span>64bit<span class="token punctuation">)</span> <span class="token punctuation">(</span>large files<span class="token punctuation">)</span> <span class="token punctuation">(</span>huge files<span class="token punctuation">)</span>\n</code></pre></div><p>这几个命令都是通过直接读取该块设备的十六进制数据来判断的, 具体的规则可参考:<br> https://github.com/file/file/blob/master/magic/Magdir/filesystems</p><h2 id="initramfs启动" tabindex="-1"><a class="header-anchor" href="#initramfs启动" aria-hidden="true">#</a> initramfs启动</h2><p>grub2找到kernel和initramfs后, 控制权交给kernel, 然后解压缩initramfs在内存中创建一个rootfs 在这个初始的小型文件系统里,加载一些基本的内核模块, 使OS能识别一些关键的外围设备. 比方说virtio块设备, virtio网络设备 这就是为什么在CentOS7下要将kvm驱动通过<code>dracut</code>打入initramfs的原理. 如果无法识别硬盘, 那么就无法真正的mount到磁盘的根目录.<br> 当initramfs文件系统挂在后, kernel将控制权交给pid为1的进程, centos7下是systemd.<br> VNC屏幕打印<code>Welcome to XXXX</code>意味着initramfs里的systemd已经开始运行. 之后出现的问题和内核就没多大关系了</p><p>https://github.com/systemd/systemd/blob/4444e8533fea1640cc9d9b1d1a493ffcbee8a13d/src/core/main.c</p><div class="language-c ext-c"><pre class="language-c"><code>        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">log_get_show_color</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n                <span class="token keyword">return</span> <span class="token function">status_printf</span><span class="token punctuation">(</span><span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span>\n                                     <span class="token string">&quot;\\nWelcome to \\x1B[%sm%s\\x1B[0m!\\n&quot;</span><span class="token punctuation">,</span>\n                                     <span class="token function">isempty</span><span class="token punctuation">(</span>ansi_color<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token string">&quot;1&quot;</span> <span class="token operator">:</span> ansi_color<span class="token punctuation">,</span>\n                                     <span class="token function">isempty</span><span class="token punctuation">(</span>pretty_name<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token string">&quot;Linux&quot;</span> <span class="token operator">:</span> pretty_name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>大致的顺序如下:</p><ol><li>dracut-cmdline解析<code>/proc/cmdline</code>, 找到真实root的信息</li><li>udev启动,识别所有的设备, 特别是硬盘,在/dev/下生成相应的信息, 这里当识别到新设备时会加载相应的驱动<br> bus驱动通过特殊的ID(设备厂商ID, 子系统ID等)识别新设备, 这个也叫MODALIAS<br> 然后modprobe MODALIAS, 会读取/lib/module/xxxx/modules.alias, 找到对应的驱动来加载驱动.<br> 对应的规则为<code>/lib/udev/rules.d/80-drivers.rules:ENV{MODALIAS}==&quot;?*&quot;, RUN{builtin}+=&quot;kmod load $env{MODALIAS}&quot;</code></li><li>initqueue阶段,有很多循环, 不停地检查一些关键任务是否完成, 比如root设备是否已识别并在<code>/dev/</code>下完成相关文件创建</li><li>mount和fsck root设备</li><li>清理就切换到真实的root设备</li></ol><p>可以在Grub菜单里给内核加参数<code>rd.break</code>使系统停留在initramfs创建后, 切换到真正的root文件系统前. 用于学习和排障<br><code>rd</code>就是<code>ramdisk</code>的缩写, 即<code>the initial ramdisk (initrd) environment</code><br><code>rd.debug</code> 可以输出详细的日志. dracut许多命令都是shell脚本. 打印详细日志的大致两种:<br> 脚本里加<code>set -x</code></p><div class="language-bash ext-sh"><pre class="language-bash"><code>$ <span class="token function">cat</span> sleep.sh\n<span class="token comment">#!/usr/bin/bash</span>\n<span class="token builtin class-name">set</span> -x\n<span class="token function">sleep</span> <span class="token number">3</span>\n$ ./sleep.sh\n+ <span class="token function">sleep</span> <span class="token number">3</span>\n<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment">#</span>\n</code></pre></div><p>再<code>set -x</code>的基础上,继续增加<code>export &#39;PS4=${BASH_SOURCE}@${LINENO}(${FUNCNAME[0]}): &#39;</code> 可打印具体的行数和函数名</p><div class="language-bah ext-bah"><pre class="language-bah"><code>$ cat sleep.sh\n#!/usr/bin/bash\nset -x\nexport &#39;PS4=${BASH_SOURCE}@${LINENO}(${FUNCNAME[0]}): &#39;\nsleep 3\n$ ./sleep.sh\n+ export &#39;PS4=${BASH_SOURCE}@${LINENO}(${FUNCNAME[0]}): &#39;\n+ PS4=&#39;${BASH_SOURCE}@${LINENO}(${FUNCNAME[0]}): &#39;\n./sleep.sh@4(): sleep 3\n</code></pre></div><p>如下文档介绍了bash下面PS相关变量可以实现的一些特殊功能<br> https://www.thegeekstuff.com/2008/09/bash-shell-take-control-of-ps1-ps2-ps3-ps4-and-prompt_command/</p><p><code>rd.udev.debug </code> 可以输入udev的详细日志</p><p>centos7还支持如下参数, 可以在特定的阶段打断OS的正常运行.</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># grep -r &quot;rd.break=&quot; /lib/dracut/modules.d/*systemd/*service</span>\n/lib/dracut/modules.d/98systemd/dracut-cmdline.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>cmdline\n/lib/dracut/modules.d/98systemd/dracut-initqueue.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>initqueue\n/lib/dracut/modules.d/98systemd/dracut-mount.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>mount\n/lib/dracut/modules.d/98systemd/dracut-pre-mount.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>pre-mount\n/lib/dracut/modules.d/98systemd/dracut-pre-trigger.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>pre-trigger\n/lib/dracut/modules.d/98systemd/dracut-pre-udev.service:ConditionKernelCommandLine<span class="token operator">=</span><span class="token operator">|</span>rd.break<span class="token operator">=</span>pre-udev\n</code></pre></div><p>initramfs大部分问题都可以通过重建initramfs解决</p><p>提取initramfs文件的命令:</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token function">mkdir</span> /tmp/initrd\n<span class="token builtin class-name">cd</span> /tmp/initrd\n/usr/lib/dracut/skipcpio /boot/initramfs-<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> -r<span class="token variable">)</span></span>.img <span class="token operator">|</span> gunzip -c <span class="token operator">|</span> cpio -idmv\n</code></pre></div><p>https://access.redhat.com/solutions/2037313</p><p>查看initramfs文件里包含的文件列表, 使用<code>lsinitrd xxx</code>, 如果要查看具体文件的内容,用如下命令:</p><div class="language-bash ext-sh"><pre class="language-bash"><code>$ lsinitrd /boot/initramfs-3.10.0-1062.el7.x86_64.img -f /etc/machine-id\nab80e79ed1cf4e9aa1108082dd40f5bc\n</code></pre></div><p>挂盘到一个虚拟机里, chroot到对应的root目录, 已3.10.0-1062.el7.x86_64为例,命令为:<br><code>dracut initramfs-3.10.0-1062.el7.x86_64.img 3.10.0-1062.el7.x86_64</code><br> 不要不加参数执行<code>dracut</code>, 因为它默认会使用当前的内核生成文件. 当前内核可能不是故障虚拟机里的内核版本</p><p>单用户 reboot, 可以使用reboot -f</p><p>运行initrd-switch-root.service完成其他工作并改变根目录为/sysroot, 系统打印如下:</p><div class="language-bash ext-sh"><pre class="language-bash"><code>Apr <span class="token number">20</span> <span class="token number">21</span>:33:52 localhost.localdomain systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Starting Switch Root<span class="token punctuation">..</span>.\nApr <span class="token number">20</span> <span class="token number">21</span>:33:52 localhost.localdomain systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Switching root.\n</code></pre></div><h2 id="切换到真实的根目录" tabindex="-1"><a class="header-anchor" href="#切换到真实的根目录" aria-hidden="true">#</a> 切换到真实的根目录</h2><p>此时会remount根目录, 然后依照依赖关系并发的启动各种功能服务<br> systemd与传统sysint不同, 随OS启动的服务如果之前没有依赖关系, 是可以同时启动的. 这有别于sysinit的串行一个一个执行, 但对于定位启动类卡住问题却带来的难度. 不能简单的通过控制台显示的最后一行信息来判断是否该服务出问题</p><p>正常启动的情况下, 我们看到一个登陆界面, 让输入用户名和密码, 这个是因为getty服务正常运行了</p><div class="language-bash ext-sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># systemctl status getty@tty1.service</span>\n● getty@tty1.service - Getty on tty1\n   Loaded: loaded <span class="token punctuation">(</span>/usr/lib/systemd/system/getty@.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: enabled<span class="token punctuation">)</span>\n   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since Mon <span class="token number">2020</span>-04-20 <span class="token number">22</span>:01:32 HKT<span class="token punctuation">;</span> 24s ago\n     Docs: man:agetty<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span>\n           man:systemd-getty-generator<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span>\n           http://0pointer.de/blog/projects/serial-console.html\n Main PID: <span class="token number">5474</span> <span class="token punctuation">(</span>agetty<span class="token punctuation">)</span>\n   CGroup: /system.slice/system-getty.slice/getty@tty1.service\n           └─5474 /sbin/agetty --noclear tty1 linux\n\nApr <span class="token number">20</span> <span class="token number">22</span>:01:32 localhost.localdomain systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Stopped Getty on tty1.\nApr <span class="token number">20</span> <span class="token number">22</span>:01:32 localhost.localdomain systemd<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Started Getty on tty1.\n<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lsof -p 5474 | grep tty1</span>\nagetty  <span class="token number">5474</span> root    0u   CHR    <span class="token number">4,1</span>       0t0  <span class="token number">5636</span> /dev/tty1\nagetty  <span class="token number">5474</span> root    1u   CHR    <span class="token number">4,1</span>       0t0  <span class="token number">5636</span> /dev/tty1\nagetty  <span class="token number">5474</span> root    2u   CHR    <span class="token number">4,1</span>       0t0  <span class="token number">5636</span> /dev/tty1\n<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment">#</span>\n</code></pre></div><p>如果系统卡住没有看到这个界面, 则继续等待几分钟, 观察是否自动进入应急模式:<br> 如果进入, 则输入root后, 运行<code>journalctl</code>查看具体的问题<br> 如果无法进入, 重新启动, 输入内核参数<code>systemd.debug-shell=1</code>, 它会在systemd启动的早期在tty9运行一个shell, 用户在vnc上运行<code>CTRL+ALT+F9</code>可登陆, 运行<code>systemctl list-jobs</code>查看具体哪个服务卡住</p><p><code>systemctl list-jobs</code> 打印状态可以是&quot;starting&quot;或者&quot;waiting&quot;<br> &quot;starting&quot;的服务是可能引发问题的服务, 正式因为它一直运行, 所有其他相关服务处于&quot;waiting&quot;状态</p><p>当并未切换到真实目录时,即界面卡在&quot;Switch root&quot;, 此时是无法启动上面的debug-shell, 需要开启systemd自身的debug日志级别<br> 同时这也说明initramfs里面的systemd是OK的, 只是启动真实跟盘上的systemd出现异常了, 可以在initramfs阶段 手工chroot到/sysroot里执行 <code>rpm -V systemd</code>, <code>rpm -V glibc</code>, <code>rpm -V bash</code> 等命令查询下基础组件是否有损坏</p><h2 id="与kdump相关的initramfs知识" tabindex="-1"><a class="header-anchor" href="#与kdump相关的initramfs知识" aria-hidden="true">#</a> 与kdump相关的initramfs知识</h2><p>有两个方法判断是否crashkernel生效</p><div class="language-bash ext-sh"><pre class="language-bash"><code>$ <span class="token function">dmesg</span> -T <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&quot;for crashkernel&quot;</span>\n<span class="token punctuation">[</span>Wed Sep  <span class="token number">9</span> <span class="token number">22</span>:24:54 <span class="token number">2020</span><span class="token punctuation">]</span> Reserving 128MB of memory at 720MB <span class="token keyword">for</span> crashkernel <span class="token punctuation">(</span>System RAM: 1535MB<span class="token punctuation">)</span>\n$ <span class="token function">cat</span> /sys/kernel/kexec_crash_size\n<span class="token number">134217728</span>\n</code></pre></div><p><code>systemctl start kdump</code>的作用是检查内核参数, 生成含kdump相关功能的initramfs.<br> 通过IN_KDUMP这个环境变量,使重建的initramfs里含有kdump所有的脚本和命令. 这样一旦转储,新的initramfs里就可以sava vmcore了</p><div class="language-bash ext-sh"><pre class="language-bash"><code>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># head /sbin/mkdumprd</span>\n<span class="token comment">#!/bin/bash --norc</span>\n<span class="token comment"># New mkdumprd</span>\n<span class="token comment">#</span>\n<span class="token comment"># Copyright 2011 Red Hat, Inc.</span>\n<span class="token comment">#</span>\n<span class="token comment"># Written by Cong Wang &lt;amwang@redhat.com&gt;</span>\n<span class="token comment">#</span>\n\n<span class="token builtin class-name">.</span> /lib/kdump/kdump-lib.sh\n<span class="token builtin class-name">export</span> <span class="token assign-left variable">IN_KDUMP</span><span class="token operator">=</span><span class="token number">1</span>\n</code></pre></div><p><code>/etc/kdump.conf</code>是关于kdump的配置项, 可给initramfs添加文件或者内核参数,调整转储失败时的动作等.</p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2><ul><li>https://freedesktop.org/wiki/Software/systemd/Debugging/</li><li>https://www.freedesktop.org/software/systemd/man/bootup.html</li><li>https://www.freedesktop.org/software/systemd/man/systemctl.html</li><li>https://www.freedesktop.org/software/systemd/man/systemd.service.html</li><li>https://www.linux.com/training-tutorials/understanding-and-using-systemd/</li><li>https://people.redhat.com/harald/dracut.html</li><li>https://man7.org/linux/man-pages/man8/dracut.8.html</li><li>https://fedoraproject.org/wiki/How_to_debug_Dracut_problems</li><li>https://documentation.suse.com/sles/12-SP4/html/SLES-all/cha-udev.html</li><li>https://wiki.archlinux.org/index.php/udev</li></ul>',61),p={render:function(n,s){return t}}}}]);