import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Issues from './pages/Issues'
import IssueDetail from './pages/IssueDetail'
import ArticleDetail from './pages/ArticleDetail'
import Authors from './pages/Authors'
import AuthorDetail from './pages/AuthorDetail'
import Submissions from './pages/Submissions'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/:issueSlug" element={<IssueDetail />} />
          <Route path="/articles/:articleSlug" element={<ArticleDetail />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:authorSlug" element={<AuthorDetail />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
