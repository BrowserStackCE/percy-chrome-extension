export type Options = {
    ignoreId: boolean
};

const defaultOptions: Options = {
    ignoreId: false
};
export function getXPath( el: any, customOptions?: Partial< Options > ): string {
    const options = { ...defaultOptions, ...customOptions };
    let nodeElem = el;
    if ( nodeElem && nodeElem.id && ! options.ignoreId ) {
        return "//*[@id=\"" + nodeElem.id + "\"]";
    }
    let parts: string[] = [];
    while ( nodeElem && Node.ELEMENT_NODE === nodeElem.nodeType ) {
        let nbOfPreviousSiblings = 0;
        let hasNextSiblings = false;
        let sibling = nodeElem.previousSibling;
        while ( sibling ) {
            if ( sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
                sibling.nodeName === nodeElem.nodeName
            ) {
                nbOfPreviousSiblings++;
            }
            sibling = sibling.previousSibling;
        }
        sibling = nodeElem.nextSibling;
        while ( sibling ) {
            if ( sibling.nodeName === nodeElem.nodeName ) {
                hasNextSiblings = true;
                break;
            }
            sibling = sibling.nextSibling;
        }
        let prefix = nodeElem.prefix ? nodeElem.prefix + ":" : "";
        let nth = nbOfPreviousSiblings || hasNextSiblings
            ? "[" + ( nbOfPreviousSiblings + 1 ) + "]"
            : "";
        parts.push( prefix + nodeElem.localName + nth );
        nodeElem = nodeElem.parentNode;
    }
    return parts.length ? "/" + parts.reverse().join( "/" ) : "";
}

export function Checksum(s:string)
{
  var chk = 0x12345678;
  var len = s.length;
  for (var i = 0; i < len; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
  }

  return (chk & 0xffffffff).toString(16);
}