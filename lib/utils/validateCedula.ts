// Validación de cédula ecuatoriana (persona natural, 10 dígitos).
export function validateCedula(cedula: string): { valid: boolean; reason?: string } {
  if (!cedula) return { valid: false, reason: 'Vacía' };
  const normalized = cedula.replace(/\D/g, '');
  if (normalized.length !== 10) return { valid: false, reason: 'Debe tener 10 dígitos' };

  const province = parseInt(normalized.substring(0, 2), 10);
  if (!(province >= 1 && province <= 24)) return { valid: false, reason: 'Código de provincia inválido' };

  const thirdDigit = parseInt(normalized[2], 10);
  if (thirdDigit >= 6) return { valid: false, reason: 'Tercer dígito inválido para cédula natural' };

  const coefficients = [2,1,2,1,2,1,2,1,2];
  const digits = normalized.split('').map(d => parseInt(d, 10));
  let total = 0;
  for (let i = 0; i < 9; i++) {
    let v = digits[i] * coefficients[i];
    if (v >= 10) v -= 9;
    total += v;
  }
  const modulo = total % 10;
  const checkDigit = modulo === 0 ? 0 : 10 - modulo;
  if (checkDigit !== digits[9]) return { valid: false, reason: 'Dígito verificador no coincide' };

  return { valid: true };
}
