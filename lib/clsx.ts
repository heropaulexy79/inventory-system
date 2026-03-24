function toVal(mix: any) {
  var k, y, str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      var len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if (y = toVal(mix[k])) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else {
      for (y in mix) {
        if (mix[y]) {
          str && (str += ' ');
          str += y;
        }
      }
    }
  }

  return str;
}

export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

export function clsx(...inputs: ClassValue[]): string {
  var i = 0, tmp, x, str = '', len = inputs.length;
  for (; i < len; i++) {
    if (tmp = inputs[i]) {
      if (x = toVal(tmp)) {
        str && (str += ' ');
        str += x;
      }
    }
  }
  return str;
}

export default clsx;
