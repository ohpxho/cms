<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in([
        __DIR__ . '/app',
        __DIR__ . '/config',
        __DIR__ . '/database/factories',
        __DIR__ . '/database/migrations',
        __DIR__ . '/database/seeders',
        __DIR__ . '/routes',
        __DIR__ . '/tests',
    ])
    ->name('*.php')
    ->notName('*.blade.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

return (new Config())
    ->setFinder($finder)
    ->setRules([
        '@PSR12' => true,
        '@PHP82Migration' => true,
        
        // Array formatting
        'array_indentation' => true,
        'array_syntax' => ['syntax' => 'short'],
        'normalize_index_brace' => true,
        'trailing_comma_in_multiline' => ['elements' => ['arrays', 'arguments', 'parameters']],
        'whitespace_after_comma_in_array' => true,
        
        // Code structure
        'binary_operator_spaces' => ['default' => 'single_space'],
        'blank_line_after_opening_tag' => true,
        'blank_line_before_statement' => ['statements' => ['return', 'try', 'throw', 'declare']],
        'concat_space' => ['spacing' => 'one'],
        'declare_strict_types' => false, // Laravel doesn't use strict types by default
        'function_declaration' => ['closure_function_spacing' => 'one'],
        'method_chaining_indentation' => true,
        'new_with_braces' => true,
        'no_blank_lines_after_class_opening' => true,
        'no_empty_statement' => true,
        'no_extra_blank_lines' => ['tokens' => ['extra', 'throw', 'use']],
        'no_multiline_whitespace_around_double_arrow' => true,
        'no_spaces_around_offset' => true,
        'no_trailing_whitespace' => true,
        'no_unused_imports' => true,
        'no_whitespace_before_comma_in_array' => true,
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'phpdoc_align' => true,
        'phpdoc_indent' => true,
        'phpdoc_order' => true,
        'phpdoc_separation' => true,
        'phpdoc_summary' => true,
        'phpdoc_trim' => true,
        'single_blank_line_at_eof' => true,
        'single_line_after_imports' => true,
        'single_quote' => true,
        'ternary_operator_spaces' => true,
        'trim_array_spaces' => true,
        
        // Laravel specific
        'not_operator_with_successor_space' => false,
        'unary_operator_spaces' => true,
    ])
    ->setIndent('  ') // 2 spaces
    ->setLineEnding("\n");