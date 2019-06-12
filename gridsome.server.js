const ButterCMS = require('buttercms');
const camelCase = require('camelcase');
const uuidv4 = require('uuid/v4');


class ButterSource {
  static defaultOptions() {
    return {
      authToken: 'bd15d8c5fe3c31340ef10a539eb8a8b5a4de9e97',
      contentFields: '',
      pages: '',
      pageTypes: '',
      typeName: 'Butter'
    };
  }

  constructor(api, options = ButterSource.defaultOptions()) {
    this.api = api;
    this.options = options;
    this.client = ButterCMS(options.authToken, false, 20000);
    if (!options.authToken) throw new Error('ButterSource: Missing API Key');

    api.loadSource(async store => {
      console.log('About to start loading data');
      await this.allButterPost(store);
      await this.allButterPages(store);
      await this.allButterCollections(store);
    });
  }

  async allButterPost(store) {
    const posts = store.addContentType({
      typeName: this.createTypeName("posts")
    });
    const post = await this.client.post.list()
    const { data } = post;
    console.log(data);
    console.log(uuidv4);
    for (const post of Object.keys(data)) {
      posts.addNode({
        title: post.title,
        url: post.url,
        featured_image: post.featured_image,
        slug: post.slug,
        created: post.created,
        published: post.published,
        summary: post.summary,
        seo_title: post.seo_title,
        body: post.body,
        meta_description: post.meta_description,
        status: post.status,
        author: post.author,
        tags: post.tags,
        categories: post.categories,
      })
    }
  }

  async allButterPages(store) {
    const pages = store.addContentType({
      typeName: this.createTypeName('pages')
    });
    const data = await this.client.page.retrieve('*', 'about')
  }

  async allButterCollections(store) {
    const collection = store.addContentType({
      typeName: this.createTypeName('collection')
    });

    const data = await this.client.content.retrieve(['artists'])
  }

  createTypeName(typeName = '') {
    return camelCase(`${this.options.typeName} ${typeName}`, {
      pascalCase: true
    });
  }
}

module.exports = ButterSource;
