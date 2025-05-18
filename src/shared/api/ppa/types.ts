declare namespace PpaApi {
    type UserExtendedResponse = {
      exKey: string,
      lastName: string,
      firstName: string,
      middleName: string,
      position: string,
      nsiOrganizationTypeExKey: string,
      nsiOrganizationTypeCode: string,
      registryOrganizationExKey: string,
      svrCode: string,
      registryOrganizationName: string,
    }
}

export type { PpaApi };
