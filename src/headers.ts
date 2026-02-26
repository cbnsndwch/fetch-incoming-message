import SuperHeaders from '@mjackson/headers';

export default class Headers extends SuperHeaders {
    get host() {
        return this.get('host');
    }
}
