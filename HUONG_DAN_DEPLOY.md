# 🚀 Hướng Dẫn Deploy lên GitHub và Vercel

## 📦 Bước 1: Deploy lên GitHub

### 1.1. Tạo Repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click nút **"New"** hoặc **"+"** → **"New repository"**
3. Điền thông tin:
   - **Repository name**: `todo-pro` (hoặc tên bạn muốn)
   - **Description**: "Todo List Pro - Ứng dụng quản lý công việc với React + Express"
   - **Visibility**: Chọn **Public** hoặc **Private**
   - **KHÔNG** tích vào "Initialize this repository with a README"
4. Click **"Create repository"**

### 1.2. Khởi tạo Git trong dự án

Mở terminal trong thư mục dự án:

```bash
# Kiểm tra Git đã cài chưa
git --version

# Nếu chưa có Git, tải tại: https://git-scm.com/downloads
```

### 1.3. Commit và Push code lên GitHub

```bash
# Khởi tạo Git repository
git init

# Thêm tất cả file vào staging
git add .

# Commit lần đầu
git commit -m "Initial commit: Todo List Pro với React + Express"

# Thêm remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/todo-pro.git

# Đổi tên branch chính thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Lưu ý**: Nếu GitHub yêu cầu authentication:
- Sử dụng **Personal Access Token** thay vì password
- Tạo token tại: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Quyền: chọn `repo` (full control)

### 1.4. Kiểm tra

Truy cập `https://github.com/YOUR_USERNAME/todo-pro` để xem code đã được upload.

---

## ☁️ Bước 2: Deploy Backend lên Vercel

### 2.1. Chuẩn bị Backend cho Vercel

Vercel hỗ trợ serverless functions. Chúng ta cần tạo cấu trúc phù hợp:

#### Tạo thư mục `api` và file serverless:

```bash
# Tạo thư mục api trong thư mục gốc
mkdir api
```

Tạo file `api/todos.js` (hoặc có thể dùng serverless functions của Vercel):

**Lưu ý**: Vercel có thể chạy Express app, nhưng cách tốt nhất là tách thành serverless functions.

### 2.2. Cấu hình Vercel

Tạo file `vercel.json` trong thư mục gốc:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**HOẶC** cách đơn giản hơn - deploy frontend và backend riêng:

---

## 🌐 Bước 3: Deploy Frontend lên Vercel (Khuyến nghị)

### 3.1. Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### 3.2. Đăng nhập Vercel

```bash
vercel login
```

### 3.3. Deploy Frontend

```bash
# Trong thư mục gốc của dự án
vercel

# Trả lời các câu hỏi:
# - Set up and deploy? Y
# - Which scope? Chọn account của bạn
# - Link to existing project? N (lần đầu)
# - Project name? todo-pro (hoặc tên bạn muốn)
# - Directory? ./
# - Override settings? N
```

### 3.4. Cấu hình Environment Variables

Sau khi deploy, cần cấu hình biến môi trường:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `todo-pro`
3. Vào **Settings** → **Environment Variables**
4. Thêm biến:
   - `VITE_API_URL`: URL của backend API

### 3.5. Cấu hình Environment Variables trong Vercel

**✅ Code đã được cập nhật tự động sử dụng environment variable!**

Bạn chỉ cần thêm biến môi trường trong Vercel:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `todo-pro`
3. Vào **Settings** → **Environment Variables**
4. Thêm biến:
   - **Key**: `VITE_API_URL`
   - **Value**: URL của backend (ví dụ: `https://todo-pro-backend.railway.app`)
   - **Environment**: Chọn `Production`, `Preview`, và `Development`
5. Click **Save**
6. **Redeploy** project để áp dụng thay đổi

**Lưu ý**: 
- Code đã tự động sử dụng `import.meta.env.VITE_API_URL`
- Nếu không có biến này, sẽ dùng `http://localhost:5000` mặc định
- Sau khi thêm biến, cần redeploy để có hiệu lực

---

## 🔧 Bước 4: Deploy Backend riêng (Khuyến nghị)

Backend nên deploy riêng vì cần chạy liên tục. Có các lựa chọn:

### Option 1: Railway (Khuyến nghị cho Node.js)

1. Truy cập [Railway](https://railway.app)
2. Đăng nhập bằng GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repository `todo-pro`
5. Cấu hình:
   - **Root Directory**: `src`
   - **Start Command**: `npm start`
   - **Build Command**: (để trống)
6. Railway sẽ tự động deploy và cung cấp URL

### Option 2: Render

1. Truy cập [Render](https://render.com)
2. Đăng nhập bằng GitHub
3. Click **"New"** → **"Web Service"**
4. Connect GitHub repository
5. Cấu hình:
   - **Name**: `todo-pro-backend`
   - **Environment**: `Node`
   - **Root Directory**: `src`
   - **Build Command**: (để trống)
   - **Start Command**: `npm start`
6. Click **"Create Web Service"**

### Option 3: Heroku

```bash
# Cài Heroku CLI
# Tải tại: https://devcenter.heroku.com/articles/heroku-cli

# Đăng nhập
heroku login

# Tạo app
heroku create todo-pro-backend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git subtree push --prefix src heroku main
```

---

## 📝 Bước 5: Cập nhật Environment Variables

**✅ Code đã được cấu hình sẵn!** Bạn chỉ cần:

1. **Lấy URL backend** sau khi deploy (từ Railway/Render/Heroku)
2. **Thêm vào Vercel Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: URL backend của bạn (ví dụ: `https://todo-pro-backend.railway.app`)
3. **Redeploy** frontend trên Vercel

**Ví dụ URL backend:**
- Railway: `https://todo-pro-production.up.railway.app`
- Render: `https://todo-pro-backend.onrender.com`
- Heroku: `https://todo-pro-backend.herokuapp.com`

---

## ✅ Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] Backend đã deploy (Railway/Render/Heroku) và có URL
- [ ] Frontend đã deploy lên Vercel
- [ ] Environment variable `VITE_API_URL` đã được thêm vào Vercel
- [ ] CORS đã được cấu hình đúng trong backend (thêm URL Vercel vào whitelist)
- [ ] Đã redeploy frontend sau khi thêm environment variable
- [ ] Test thử tất cả chức năng trên production
- [ ] Kiểm tra console browser không có lỗi CORS

---

## 🔗 Liên kết hữu ích

- [GitHub Docs](https://docs.github.com)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

---

## 🐛 Troubleshooting

### Lỗi CORS khi deploy

**✅ Code đã được cập nhật tự động hỗ trợ CORS!**

Có 2 cách để cấu hình:

**Cách 1: Sử dụng Environment Variable (Khuyến nghị)**

Thêm biến môi trường `FRONTEND_URL` trong backend platform (Railway/Render/Heroku):
- Key: `FRONTEND_URL`
- Value: URL Vercel của bạn (ví dụ: `https://todo-pro.vercel.app`)

**Cách 2: Cập nhật code trực tiếp**

Nếu cần, có thể cập nhật `src/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app',  // Thêm URL Vercel của bạn
  'https://your-custom-domain.com'  // Custom domain nếu có
];
```

**Lưu ý**: 
- Code hiện tại đã cho phép tất cả origin trong development
- Trong production, chỉ cho phép origin trong whitelist
- Sau khi cập nhật, commit và push lại lên GitHub
- Backend sẽ tự động redeploy (nếu dùng Railway/Render)

### Backend không kết nối được

- Kiểm tra URL backend có đúng không
- Kiểm tra CORS settings
- Kiểm tra logs trên platform deploy backend

### Environment variables không hoạt động

- Đảm bảo biến bắt đầu bằng `VITE_` cho Vite
- Restart deployment sau khi thêm biến mới
- Kiểm tra trong Vercel Dashboard → Settings → Environment Variables

---

## 💡 Mẹo

1. **Sử dụng Custom Domain**: Có thể thêm domain riêng trong Vercel settings
2. **Auto Deploy**: Mỗi khi push lên GitHub, Vercel sẽ tự động deploy
3. **Preview Deployments**: Mỗi Pull Request sẽ có URL preview riêng
4. **Monitoring**: Sử dụng Vercel Analytics để theo dõi performance

