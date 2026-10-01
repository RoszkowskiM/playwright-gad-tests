import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { pageObjectTest } from '@_src/ui/fixtures/page-object.fixture';
import { addArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage } from '@_src/ui/pages/article.page';

interface ArticleCreationContext {
  articlePage: ArticlePage;
  articleData: addArticleModel;
}

interface ArticleFixtures {
  createRandomArticle: ArticleCreationContext;
}

export const articleTest = pageObjectTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ addArticleView }, use) => {
    const articleData = prepareRandomArticle();
    const articlePage = await addArticleView.createArticle(articleData);
    await use({ articlePage, articleData });
  },
});
