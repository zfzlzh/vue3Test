export default {
    placeholderLength(str) {
        let byteValLen = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i].match(/[^\x00-\xff]/ig) != null) {
                byteValLen += 2;
            } else {
                byteValLen += 1;
            }
        }
        return byteValLen;
    }
}