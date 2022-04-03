interface Contributor {
  name: string
  email: string
  url: string
}

export interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  scripts: {
    [name: string]: string
  }
  authors: string[]
  contributors: Contributor[]
  license: string
  devDependencies?: {
    [packageName: string]: string
  }
  dependencies?: {
    [packageName: string]: string
  }
  repository?: {
    type: string
    url: string
  }
  keywords?: string[]
  bugs?: {
    url: string
  }
  homepage?: string
}
