export default interface CompanyDto {
  _id: string;
  name: string;
  abbreviatedName: string;
  inn: number;
  contacts: Record<string, any>;
  deleted_at: string;
  is_deleted: boolean;
}
