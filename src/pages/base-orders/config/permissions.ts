export const MANAGEMENT_PERMISSIONS = {
  view: {
    DOC_CS_0004: [
      'FO_DOC_CS_0004_VIEW',
      'TOFK_DOC_CS_0004_VIEW',
      'TOFK_PC_DOC_CS_0004_VIEW',
      'TGVF_DOC_CS_0004_VIEW',
    ],
  },
  create: {
    DOC_CS_0004: [
      'FO_DOC_CS_0004_CREATE',
      'TGVF_DOC_CS_0004_CREATE',
    ],
  },
  formActionsMenu: {
    DOC_CS_0004: [
      'FO_DOC_CS_0004_CONFORM',
      'FO_DOC_CS_0004_APPROVE',
      'FO_DOC_CS_0004_CREATE',
      'TGVF_DOC_CS_0004_CREATE',
      'TGVF_DOC_CS_0004_APPROVE',
      'TGVF_DOC_CS_0004_CONFORM',
    ],
  },
  applicationFilterControls: {
    DOC_CS_0004: [
      'TOFK_PC_DOC_CS_0004_VIEW',
    ],
  },
  tableColumns: {
    DOC_CS_0004: [
      'TOFK_PC_DOC_CS_0004_VIEW',
      'TGVF_DOC_CS_0004_VIEW',
    ],
  },
  filterStatuses: {
    DRAFT: [
      'FO_DOC_CS_0004_VIEW',
    ],
    TO_CONFORM: [
      'FO_DOC_CS_0004_VIEW',
    ],
    TO_APPROVE: [
      'FO_DOC_CS_0004_VIEW',
    ],
    TO_TOFK: [
      'FO_DOC_CS_0004_VIEW',
    ],
    TOFK_RECEIVED: [
      'FO_DOC_CS_0004_VIEW',
    ],
    EXECUTED: [
      'FO_DOC_CS_0004_VIEW',
      'TOFK_DOC_CS_0004_VIEW',
      'TOFK_PC_DOC_CS_0004_VIEW',
      'TGVF_DOC_CS_0004_VIEW',
    ],
    ERROR: [
      'FO_DOC_CS_0004_VIEW',
      'TOFK_DOC_CS_0004_VIEW',
      'TOFK_PC_DOC_CS_0004_VIEW',
      'TGVF_DOC_CS_0004_VIEW',
    ],
    DELETED: [
      'FO_DOC_CS_0004_VIEW',
      'TGVF_DOC_CS_0004_VIEW',
    ],
  },
};
