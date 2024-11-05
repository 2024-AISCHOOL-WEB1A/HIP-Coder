def tokenize_url(url):
            tokens = []
            for part in url.split('/'):
                tokens.extend(part.split('.'))
            return ' '.join(tokens)