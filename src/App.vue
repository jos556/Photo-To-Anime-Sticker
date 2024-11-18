<template>
  <div class="stars"></div>
  <div class="twinkling"></div>
  <header class="header">
    <h1>照片動漫貼紙製作器</h1>
    <nav>
      <router-link to="/">首頁</router-link> |
      <router-link to="/gallery">作品集</router-link>
    </nav>
  </header>
  <main class="main-content">
    <div class="content-container">
      <router-view></router-view>
    </div>
  </main>
</template>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(0, 0, 0, 0.4);
  border-radius: 20px 20px 20px 20px;
  margin: 0 20px 0 20px;
}

.header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 0.8rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  font-weight: 600;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

nav a {
  color: #666;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

nav a:hover {
  color: #42b983;
  background: rgba(66, 185, 131, 0.1);
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
  background: rgba(66, 185, 131, 0.15);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 2rem;
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 120px);
}

.content-container {
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 星空背景 */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a2e url(/stars.jpg) repeat;
  z-index: 1;
  opacity: 0.8;
}

.twinkling {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent url(/twinkling.png) repeat;
  z-index: 1;
  animation: move-twinkle 200s linear infinite;
  opacity: 0.5;
}

@keyframes move-twinkle {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -10000px 5000px;
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .content-container {
    padding: 1.5rem;
  }

  nav {
    gap: 1rem;
  }

  nav a {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
