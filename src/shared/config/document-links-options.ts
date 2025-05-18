import { DateViewEnum } from '@ebp/utils';

export enum ObjectCode {
  DOC_CS_0184_VIEW = 'DOC_CS_0184_VIEW',
  DOC_CS_0185_VIEW = 'DOC_CS_0185_VIEW',
  DOC_CS_0186_VIEW = 'DOC_CS_0186_VIEW',
  DOC_CS_0187_VIEW = 'DOC_CS_0187_VIEW',
  DOC_CS_0188_VIEW = 'DOC_CS_0188_VIEW',
  DOC_CS_0189_VIEW = 'DOC_CS_0189_VIEW',
}

const linksMap = [
  {
    objectCode: 'DOC_CS_0001',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/cards/uf-cash/${exKey}`,
  },
  {
    objectCode: 'DOC_CS_0002',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/cards/ct-cash/${exKey}`,
  },
  {
    objectCode: 'DOC_CS_0003',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/cards/ctd-cash/${exKey}`,
  },
  {
    objectCode: 'DOC_CS_0004',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/receipts/${exKey}`,
  },
  {
    objectCode: 'DOC_CS_0005',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/payments/${exKey}`,
  },
  {
    objectCode: 'DOC_CS_0006',
    mfeSection: 'cash',
    urlGetter: (mfeUrl:string, exKey:string) => `${mfeUrl}/account/statement/${exKey}`,
  },
];

export const documentLinksOptions = {
  linksMap,
  noTimeZone: true,
  dateView: DateViewEnum.date,
  disableLinks: false,
};
