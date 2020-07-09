export const ALREADY_KNOWN_STUDY = {
  key: 'ALREADY_KNOWN_STUDY',
  content: 'This study is already known by the server.',
  ignorable: false,
  dismissed: false
}

export const NOT_EXPECTED_VISIT = {
  key: 'NOT_EXPECTED_VISIT',
  content: 'You should check/select the patient. The imported study informations do not match with the expected ones.',
  ignorable: true,
  dismissed: false
}

export const NULL_VISIT_ID = {
  key: 'NULL_VISIT_ID',
  content: 'You should check/select the patient. Null visit ID.',
  ignorable: false,
  dismissed: false
}

export const MISSING_TAG_00080060 = {
  key: 'MISSING_TAG_00080060',
  content: 'Missing tag: Modality',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00080022 = {
  key: 'MISSING_TAG_00080022',
  content: 'Missing tag: Series Date',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00101030 = {
  key: 'MISSING_TAG_00101030',
  content: 'Missing tag: Patient Weight',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00101031 = {
  key: 'MISSING_TAG_00101031',
  content: 'Missing tag: Series Time',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00181074 = {
  key: 'MISSING_TAG_00181074',
  content: 'Missing tag: Radionuclide Total Dose',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00181072 = {
  key: 'MISSING_TAG_00181072',
  content: 'Missing tag: Radiopharmaceutical Start Time',
  ignorable: true,
  dismissed: false
}

export const MISSING_TAG_00181075 = {
  key: 'MISSING_TAG_00181075',
  content: 'Missing tag: Radionuclide Half Life',
  ignorable: true,
  dismissed: false
}

export const LESS_THAN_MINIMAL_INSTANCES = {
  key: 'LESS_THAN_MINIMAL_INSTANCES',
  content: 'This serie contains less than minimal instance number',
  ignorable: true,
  dismissed: false
}
