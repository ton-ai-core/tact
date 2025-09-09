contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test(): Int? {
        return self.storage.g3t(1); // Should suggest "get"
    }
    
    receive() {}
}