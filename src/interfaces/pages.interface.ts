import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { LoginPage } from '@_src/pages/login.page';
import { RegisterPage } from '@_src/pages/register.page';
import { AddArticleView } from '@_src/views/add-article.view';

export interface Pages {
  addArticleView: AddArticleView;
  articlePage: ArticlePage;
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}
