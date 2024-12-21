import { Tables } from "./database.types"

export type USDAFood = Omit<Tables<'usda_foods'>, 'embedding' | 'fts'>

export type PredictionWithUSDA = Tables<'predictions'> & {
    usda_food?: USDAFood | null
    corrected_usda_food?: USDAFood | null
}