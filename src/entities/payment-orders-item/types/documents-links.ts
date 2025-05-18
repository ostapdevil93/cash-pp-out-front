export type DocumentLinksResponseSourceItem = {
  targetExKey: string,
  targetObjectCode: string,
  targetNumber: string,
  description: string,
  active: boolean,
}

export type DocumentLinksResponseTargetItem = {
  sourceExKey: string,
  sourceObjectCode: string,
  sourceNumber: string,
  description: string,
  active: boolean,
}

export type DocumentLinksResponse = {
  sourceLinks: DocumentLinksResponseSourceItem[],
  targetLinks: DocumentLinksResponseTargetItem[],
  totalCount: number,
}
