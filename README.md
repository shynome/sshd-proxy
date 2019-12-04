## 简介

使用命令 `ssh -NT -L 0.0.0.0:${port}:${remoteHost}:${remotePort}` 将远程服务器的端口转发到本地进行调试

使用 `pm2` 管理多个 `ssh` 转发命令, 这个项目就是用以方便管理多个转发命令的 WEB UI

## 隐藏功能

- 会读取主目录下面 `~/.ssh/**/*.conf` 和 `~/.ssh/config` 的 `ssh config`, 从中获取已配置的 `host` 主机名

## 运行

- 需要熟悉 `ssh config` 配置
- 主机设置: 需要在 `/root/.ssh/config` 中设置好密钥登录, 然后挂载到容器中 `-v /root/.ssh:/root/.ssh`
- 数据存储: 挂载目录 `-v /srv/sshd-proxy/data:/app/data`
- 认证凭据: 该项目没有任何认证. 推荐使用 https 客户端证书进行认证, 所以该项目需要运行在反向代理后面. 客户端证书管理工具可以使用 `Xca` 进行管理

```sh
# 快速预览
docker run --rm -ti -p 127.0.0.1:3000:3000 -v ~/.ssh:/root/.ssh shynome/sshd-proxy
# 在浏览器打开 http://127.0.0.1:3000 进行预览
# 不能正常运行, 因为容器里面用户是 `root`, 而当前用户不是, `root`无法访问密钥
```

## 开发

### 环境

- `nodejs` `12`
- `ssh` `7.2`
- `yarn` `1.19`
- `debian` `10`

### 运行

破

```sh
git clone git@github.com:shynome/sshd-proxy.git
cd sshd-proxy
yarn install
# 开发
yarn next
# 运行
yarn build && yarn next start
```
