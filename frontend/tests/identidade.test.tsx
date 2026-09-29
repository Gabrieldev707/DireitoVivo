import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('metadados da demonstração', () => {
  it('evita promessas absolutas e fontes remotas no documento inicial', () => {
    const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
    expect(html).not.toMatch(/triagem anônima|anônimo, gratuito|sem armazenar dado nenhum/i);
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).toMatch(/projeto independente/i);
  });
});
