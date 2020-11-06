import { 
  change_1987_1999_vs_2000_2019, 
  change_1930_1969_vs_2000_2019, 
  bsbiHectadDateClassesNewest,  
  bsbiHectadDateClassesOldest, 
  nativeSpeciesStatus,
  bsbiHectadDateTetFreq,
  setDataRoot
} from './src/bsbiAtlasDataAccess.js'
import pkg from './package.json'

// Output version from package json to console
// to assist with trouble shooting.
console.log(`Running ${pkg.name} version ${pkg.version}`)

export { 
  change_1987_1999_vs_2000_2019, 
  change_1930_1969_vs_2000_2019, 
  bsbiHectadDateClassesNewest,  
  bsbiHectadDateClassesOldest, 
  nativeSpeciesStatus,
  bsbiHectadDateTetFreq,
  setDataRoot
} 
