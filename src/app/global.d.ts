import type { Database as DB } from '@@/utils/db/database.types'

declare global {
    type Database = DB
    type Accounts = DB['public']['Tables']['accounts']['Row'];
    type Amenities = DB['public']['Tables']['amenities']['Row'];
    type Profiles = DB['public']['Tables']['profiles']['Row'];
    type Projects = DB['public']['Tables']['projects']['Row'];
    type Transaction = DB['public']['Tables']['transactions']['Row'];
}
