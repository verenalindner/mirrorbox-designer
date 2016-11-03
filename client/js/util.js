function getParser(editable){
	if(!parser){
		return new Parser(editable);
	} else {
		return parser;
	}
}